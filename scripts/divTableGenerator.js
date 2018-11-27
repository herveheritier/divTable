/*
(lang,EN:[
Create a HMTL table composed only with div tag

    Call `create(content)` to create a new table
    whith `content` as an object composed as
    {
        header (optional)   : array of string|object,
        rows                : array of array of string|object,
        foot (optional)     : array of string|object
    }

    Controls

        - header, foot and each array in rows had the same length
        - elements in header and foot are string or object
        - elements in rows are arrays, and this arrays contains string or object
        - object may pased a JSON.stringify without errors

    On error throw an exception.

    Return a div element to place in the DOM

Add a new row in a existant table

    Call `add(table,content)`

Remove a 
])
(lang,FR:[
Création d'un tableau HTML composé de div

    Appeler `create(content)` pour créer un nouveau tableau
    avec `content` qui est un object de la forme
    {
        header (optional)   : array de string|object,
        rows                : array de array of string|object,
        foot (optional)     : array de string|object
    }

    Controles

        - header, foot et tous les array de rows doivent contenir le même nombre d'élément
        - les elements dans header et foot sont des string ou des object
        - les elements dans rows sont des arrays, et chaque array qui représente une ligne du tableau contient des string ou des object
        - les object doivent passer la fonction JSON.stringify sans erreurs

    Les erreurs lèvent des exceptions.

    Retourne une div à insérer dans le DOM

Ajouter une nouvelle ligne dans le tableau

    Appeler `add(table,content)`
])
*/

const DivTable = {
    updateStyleDone:false,
    updateStyle : function() {
        if(DivTable.updateStyleDone) return
        DivTable.updateStyleDone = true
        if(document.styleSheets.length==0) document.documentElement.appendChild(document.createElement('style'))
        var css = document.styleSheets[0]
        css.insertRule('.table { display: table; }',0)
        css.insertRule('.row { display: table-row; }',0)
        css.insertRule('.headerGroup { display: table-header-group }',0)
        css.insertRule('.rowGroup { display: table-row-group; }',0)
        css.insertRule('.footGroup { display: table-footer-group; }',0)
        css.insertRule('.rowCell { display: table-cell; }',0)
        css.insertRule('.headerCell { display: table-cell; }',0)
        css.insertRule('.footCell { display: table-cell; }',0)
        css.insertRule('.columnGroup { display: table-column-group; }',0)
        css.insertRule('.column { display: table-column; }',0)
        css.insertRule('.caption { display: table-caption }',0)
        return css
    },
    isValidElement : function(e) {
        if(typeof(e)==='string') return true
        try {
            JSON.stringify(e)
        } catch (error) {
            console.log(error)
            return false
        }
        if(typeof(e)==='object') return true
        return false
    },
    create : function(content) {
        if(!content) 
            throw "Parameter is omit"
        if(!content.rows)
            throw "Parameter do not contains a 'rows' element"
        if(!Array.isArray(content.rows))
            throw "'rows' element is not an array"
        if(!content.rows.every(e => Array.isArray(e)))
            throw "at least one 'rows' element is not an array"
        content.rows.forEach( r => {
            if(!r.every(e => DivTable.isValidElement(e)))
                throw "at least one 'rows' element is invalid"
        })
        var ln = content.rows[0].length
        if(!content.rows.every(e => e.length==ln))
            throw "'rows' does not contains the same number of elements in each row"
        if(content.header) {
            if(!Array.isArray(content.header))
                throw "'header' element is not an array"
            if(content.header.length!=ln)
                throw "inconsistent number of elements beetween 'header' and every row of 'rows'"
            if(!content.header.every(e => DivTable.isValidElement(e)))
                throw "at least one 'header' element is invalid"
        }
        if(content.foot) {
            if(!Array.isArray(content.foot))
                throw "'foot' element is not an array"
            if(content.foot.length!=ln)
                throw "inconsistent number of elements beetween 'foot' and every row of 'rows'"
            if(!content.foot.every(e => DivTable.isValidElement(e)))
                throw "at least one 'foot' element is invalid"
        }
        var d = DivTable.newDiv('table')
        if(content.header) {
            var h =  DivTable.newDiv("headerGroup")
            content.header.map(e=>{
                var c = DivTable.newDiv("headerCell")
                c.appendChild(DivTable.newSpan(e))
                return c
            }).forEach(e=>h.appendChild(e))
            d.appendChild(h)
        }
        var rg = DivTable.newDiv("rowGroup")
        content.rows.forEach(w=>{
            var r = DivTable.newDiv("row") 
            w.map(e=>{
                var c = DivTable.newDiv("rowCell")
                c.appendChild(DivTable.newSpan(e))
                return c
            }).forEach(e=>r.appendChild(e))
            rg.appendChild(r)
        })
        d.appendChild(rg)
        if(content.foot) {
            var h =  DivTable.newDiv("footGroup")
            content.foot.map(e=>{
                var c = DivTable.newDiv("footCell")
                c.appendChild(DivTable.newSpan(e))
                return c
            }).forEach(e=>h.appendChild(e))
            d.appendChild(h)
        }
        DivTable.updateStyle()
        return d
    },
    newDiv : function(classe) {
        var d = document.createElement('div')
        d.classList.add(classe)
        return d
    },
    newSpan : function(text) {
        var s = document.createElement('span')
        s.appendChild(document.createTextNode(text))
        return s
    },
}


