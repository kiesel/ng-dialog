# dialog on angular.js

This website is based on thekid/dialog, an XP Framework website.

## Importing existing dialog contents into ng-dialog:

1. Copy the `data/` directory into `app/data/` in ng-dialog
2. Convert all PHP-serialized data into json documents:

    $ find app/data -name '*.dat' -o -name '*.idx' -o -name '*.ser' | xargs xp -cp contrib/ Serialized2Json

3. Create full index from all page_*.idx files:

    $ xp -cp contrib/ AggregatePages2Json app/data/

4. Adjust appConfig in `app/scripts/controllers/main.js` (TBD: refactor out)