# dialog on angular.js

This website is based on thekid/dialog, an XP Framework website.

## Converting PHP serialized data into json structures

There's a contrib script to convert all data:

    $ find app/data -name '*.dat' -o -name '*.idx' -o -name '*.ser' | xargs xp Serialized2Json

