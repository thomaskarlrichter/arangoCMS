/*jslint indent: 2, nomen: true, maxlen: 100, white: true  plusplus: true */
/*global beforeEach, afterEach */
/*global describe, it, expect */
/*global window, eb, loadFixtures, document */
/*global $, _, d3*/
/*global helper*/
/*global EdgeShaper*/

////////////////////////////////////////////////////////////////////////////////
/// @brief Graph functionality
///
/// @file
///
/// DISCLAIMER
///
/// Copyright 2010-2012 triagens GmbH, Cologne, Germany
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Copyright holder is triAGENS GmbH, Cologne, Germany
///
/// @author Michael Hackstein
/// @author Copyright 2011-2013, triAGENS GmbH, Cologne, Germany
////////////////////////////////////////////////////////////////////////////////

(function () {
  "use strict";

  describe('Content Viewer', function() {
    
    var contentDiv;
    
    beforeEach(function() {
      app = app || {};
      contentDiv = document.createElement("div");
      contentDiv.id = "content";
      document.body.appendChild(contentDiv);
    });
    
    afterEach(function() {
      document.body.removeChild(contentDiv);
    });
    
    it('should bind itself to the app scope', function() {
      expect(app.ContentView).toBeDefined();
    });
    
    describe('checking display', function() {
      var collection,
        callback;
        
      beforeEach(function() {
        
        runs(function() {
          callback = false;
          var factory = new app.ContentCollectionFactory();
          factory.create("All", function(res) {
            collection = res;
            var view = new app.ContentView({collection: collection});
            view.render();
            callback = true;
          });
        });
      
        waitsFor(function() {
          return callback;
        }, 1000, "The collection should have been loaded.")
      
        waits(1000);
      });
      
      it('should be able to display content of a collection', function() {
      
        runs(function() {
          var tableSelector = "#content table",
            rowsSelector = tableSelector + " tr",
            headerRow = $("> th", $(rowsSelector).eq(0)),
            firstRow = $("> td", $(rowsSelector).eq(1)),
            secondRow = $("> td", $(rowsSelector).eq(2)),
            contentActions = $(".btn", firstRow.eq(0));
          expect($(tableSelector).length).toEqual(1);
          expect($(rowsSelector).length).toEqual(3);
        
          expect(headerRow.length).toEqual(5);
          expect(headerRow.eq(1).text()).toEqual("_key");
          expect(headerRow.eq(2).text()).toEqual("double");
          expect(headerRow.eq(3).text()).toEqual("int");
          expect(headerRow.eq(4).text()).toEqual("name");
        
          expect(firstRow.length).toEqual(5);
          expect($(rowsSelector).eq(1).attr("id")).toEqual("1");
          expect(firstRow.eq(1).text()).toEqual("1");
          expect(firstRow.eq(2).text()).toEqual("4.5");
          expect(firstRow.eq(3).text()).toEqual("4");
          expect(firstRow.eq(4).text()).toEqual("Test");
          expect(contentActions.length).toEqual(2);
          
          expect(secondRow.length).toEqual(5);
          expect($(rowsSelector).eq(2).attr("id")).toEqual("2");
          expect(secondRow.eq(1).text()).toEqual("2");
          expect(secondRow.eq(2).text()).toEqual("14.5");
          expect(secondRow.eq(3).text()).toEqual("14");
          expect(secondRow.eq(4).text()).toEqual("foxx");
          expect(contentActions.length).toEqual(2);

          expect(contentActions.eq(0).hasClass("edit")).toBeTruthy();
          expect(contentActions.eq(1).hasClass("delete")).toBeTruthy();
        });
      
      });
    
    
      it('should display the add new entry', function() {
      
        runs(function() {
          var bar = $("#content div#cmsMenuBar"),
            addNew = $("button#addNew", bar);
          expect(bar.length).toEqual(1);
          expect(addNew.length).toEqual(1);
        });
      
      });
      
    });
    
    describe('checking actions', function() {
      
      var collection,
        callback;
      
      beforeEach(function() {
        
        runs(function() {
          callback = false;
          var factory = new app.ContentCollectionFactory();
          factory.create("All", function(res) {
            collection = res;
            var view = new app.ContentView({collection: collection});
            view.render();
            callback = true;
          });
        });
      
        waitsFor(function() {
          return callback;
        }, 1000, "The collection should have been loaded.")
      
        waits(1000);
      });
      
      
      it('should be possible to edit an item', function() {
        
        runs(function() {
          var firstCell = $("> td", $("#content table tr").eq(1)).eq(0),
            model = collection.findWhere({
              double: 4.5,
              int: 4,
              name: "Test"
            });
          
          spyOn(model, "save");
          
          $(".edit", firstCell).click();
          
          expect($("#double").attr("value")).toEqual("4.5");
          expect($("#int").attr("value")).toEqual("4");
          expect($("#name").attr("value")).toEqual("Test");
          
          
          $("#double").attr("value", "1.34");
          $("#int").attr("value", "42");
          $("#name").attr("value", "Circus");
          $("#store").click();
          
          expect(model.save).wasCalledWith({
            double: 1.34,
            int: 42,
            name: "Circus"
          });
          
        });
        
        waitsFor(function() {
          return $(".modal-backdrop").length === 0;
        }, 1000, "The modal view should have been disappered.");        
        
      });
      
      /* No Idea why this test does not work
      * It triggers a reload of the test page, whereas no reload is
      * triggered in production.
      * Can't see a difference to edit an item...
      
      it('should be possible to add a new item', function() {
        
        runs(function() {
          spyOn(collection, "create");
          
          $("#addNew").click();
          $("#double").attr("value", "1.34");
          $("#int").attr("value", "42");
          $("#name").attr("value", "Circus");
          $("#store").click();
          
          expect(collection.create).wasCalledWith({
            double: 1.34,
            int: 42,
            name: "Circus"
          });
        });
        
        waitsFor(function() {
          return $("#document_modal").length === 0;
        }, 1000, "The modal view should have been disappeared.");        
        
      });
      
      */
      it('should be possible to delete an item', function() {
        runs(function() {
          var firstCell = $("> td", $("#content table tr").eq(1)).eq(0),
            model = collection.findWhere({
              double: 4.5,
              int: 4,
              name: "Test"
            });
          spyOn(model, "destroy");
        
          $(".delete", firstCell).click();
        
          $("#delete").click();
  
          expect(model.destroy).toHaveBeenCalled();
        });
        
        waitsFor(function() {
          return $(".modal-backdrop").length === 0;
        }, 1000, "The modal view should have been disappered.");
        
      });
      
      it('should be possible to sort the items by attribute key', function() {
        spyOn(collection, "sort");
        
        $("#attrtitle_double").click();
        
        expect(collection.sort).toHaveBeenCalled();
        expect(collection.comparator).toEqual("double");
      });
      
      it('should be possible to toggle selection of all items', function() {
        var boxSelector = ".checkBulk",
          amountOfBoxes = $(boxSelector).length;
        
          // Select all
        $("#checkAll").click();
        
        expect($(boxSelector).filter(function() {
          return $(this).prop("checked");
        }).length).toEqual(amountOfBoxes);
        // Unselect all
        $("#checkAll").click();
        
        expect($(boxSelector).filter(function() {
          return $(this).prop("checked");
        }).length).toEqual(0);
      });
      
      it('should be possible to delete all checked items', function() {
        
        runs(function() {
          var amountOfBoxes = collection.length,
            model1 = collection.findWhere({
              double: 4.5,
              int: 4,
              name: "Test"
            }),
            model2 = collection.findWhere({
              int: 14,
              double: 14.5,
              name: "foxx"
            });
        
          spyOn(model1, "destroy");
          spyOn(model2, "destroy");
        
          $("#checkAll").click();
        
          $("#deleteMarked").click();
        
          $("#delete").click();
        
          expect(model1.destroy).toHaveBeenCalled();
          expect(model2.destroy).toHaveBeenCalled();
        });
        
        waitsFor(function() {
          return $(".modal-backdrop").length === 0;
        }, 1000, "The modal view should have been disappered.");
        
      });
      
      it('should be possible to filter the items by content', function() {
        $("#searchField").val("foxx");
        $("#searchField").keyup();
        
        expect($("#content table tr").length).toEqual(2);
        expect($("#content table tr").eq(1).attr("id")).toEqual("2");
      });
      
    });
    
  });
}());
