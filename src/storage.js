import { format } from "date-fns";

// @ts-ignore
export const localStorageBackup = () => {
    var backup = {};
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        backup[key] = escape(encodeURIComponent(value));
    }
    var json = JSON.stringify(backup);
    var base = btoa(json);
    var href = 'data:text/javascript;charset=utf-8;base64,' + base;
    var link = document.createElement('a');
    link.setAttribute('download', 'VCM-' + format(new Date(), 'yyyy-MM-dd') + '.json');
    link.setAttribute('href', href);
    document.querySelector('body').appendChild(link);
    link.click();
    link.remove();
};

// @ts-ignore
export const localStorageRestore = () => {
    var t = document.createElement('div');
    var a = document.createElement('a');
    a.appendChild(document.createTextNode('X'));
    a.setAttribute('href', '#');

    a.style.position = 'absolute';
    a.style.top = '10px';
    a.style.right = '10px';
    a.style['text-decoration'] = 'none';
    a.style.color = '#fff';
    t.appendChild(a);
    a.onclick = function () {
        t.remove();
    };
    t.style.width = '50%';
    t.style.position = 'absolute';
    t.style.top = '25%';
    t.style.left = '25%';
    t.style['background-color'] = 'gray';
    t.style['text-align'] = 'center';
    t.style.padding = '50px';
    t.style.color = '#fff';
    t.style['z-index'] = 10000;

    var l = document.createElement('input');
    l.setAttribute('type', 'file');
    l.setAttribute('id', 'fileinput');
    l.onchange = function (e) {
        t.remove();
        // @ts-ignore
        var f = e.target.files[0];
        if (f) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var text = e.target.result;
                // @ts-ignore
                var backup = JSON.parse(text);
                for (var key in backup) {
                    var value = decodeURIComponent(unescape(backup[key]));
                    window.localStorage.setItem(key, value);
                }
                alert(Object.keys(backup).length + ' éléments importés.')
            };
            reader.readAsText(f);
        } else {
            alert('Impossible de charger le fichier');
        }
    };
    var b = document.createElement('h3');
    b.appendChild(document.createTextNode('Veuillez sélectionner un fichier de sauvegarde .json'));
    t.appendChild(a);
    t.appendChild(l);
    document.querySelector('body').appendChild(t);
};

// @ts-ignore
export const localStorageClear = () => {
    if (window.confirm('Do you really want to delete all ' + localStorage.length + ' localStorage items of this website?')) {
        localStorage.clear();
    }
}