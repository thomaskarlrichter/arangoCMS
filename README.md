Arango CMS
==========

This is a Content Management System for the ArangoDB.
It is based on struct information.


# How To Use

More details will be added as soon as struct information is fully implemented.

## Add a Collection that should be managed

* Add a Collection you would like to manage.
* Add struct information for this collection.


## Installation

After [installing ArangoDB](http://www.arangodb.org/download), start your server and point it to the location of the cloned repository:

    $ arangod --javascript.dev-app-path /path/to/aye_aye /path/to/your/arango_db

Then start your Arango shell (`$ arangosh`) and run the following commands:

    arangosh> aal = require('org/arangodb/aal')
    arangosh> aal.updateFishbowl()
    arangosh> aal.load("github", "arangoCMS")
    arangosh> aal.installApp("arangoCMS", "/cms")

In this case the CMS gets mounted to '/cms'.
Point your browser to `http://localhost:8529/cms/` to access the FrontEnd.
You should now see a page with a navigation bar on top.
This navigation bar should contain all collections you added struct information to.
By clicking on one of these tabs you can access the contents of the respective collection.
Each entry will offer you two options: Edit and Delete at the beginning of the row.
In addition an option is given to add a new Document to your collection.

## License

This code is distributed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).