
const scrapper = () => {
    const parts = [];
    for (var i = 2; i < 25; i++) {
        if (document.getElementById('p' + i)) {
            parts.push(document.getElementById('p' + i).innerText);
        }
    }

    const week = {
        songs: [],
        priers: ['Prière 1', 'Prière 2'],
        chairMan: 'Président',
        weekReading: 'GENÈSE 1-3',
        gem: {
            title: '« Joyaux »',
            speaker: 'Frère Jacques'
        },
        pearls: {
            title: 'Perles spirituelles',
            speaker: 'Frère Jacques'
        },
        schools: [
            {
                name: 'SALLE PRINCIPALE',
                reading: 'Frère Jacques 1',
                parts: []
            }
        ],
        vcm: {
            parts: []
        }
    }

    var schoolIndex = 0;
    var vcmIndex = 0;
    var endIndex = 0;

    parts.forEach((p, i) => {
        if (p == "APPLIQUE-​TOI AU MINISTÈRE") {
            schoolIndex = i;
        }
        if (p == "VIE CHRÉTIENNE") {
            vcmIndex = i;
        }
        if (p.includes("Paroles de conclusion")) {
            endIndex = i;
        }

    });

    parts.forEach((p, i) => {
        if (i == 0) {
            week.weekReading = p;
        }
        if (i == 1) {
            week.songs = [];
            week.songs[0] = p.match(/\d+/)[0]
        }
        if (i == 4) {
            week.gem.title = p;
        }
        if (i == 5) {
            week.pearls.title = p;
        }
        if (i > schoolIndex && i < vcmIndex) {
            week.schools[0].parts.push({ title: p.includes(':') ? p.split(/\)\s\:/)[0] + ')' : p, students: ['Pauline', 'Jacques'], type: p.includes('Discours') ? 'school_talk' : undefined, lesson: p.match(/leçon\s(\d+)/) ? p.match(/leçon\s(\d+)/)[1] : undefined });
        }
        if (i > vcmIndex + 1 && i < endIndex - 1) {
            week.vcm.parts.push({ title: p.includes(':') ? p.split(/\)\s\:/)[0] + ')' : p, speaker: 'Frère Jacques' });
        }
        if (i === endIndex - 1) {
            week.vcm.parts.push({ title: p.includes(':') ? p.split(/\)\s\:/)[0] + ')' : p, speaker: 'Frère Jacques', reader: 'Frère Jacques' });
        }

        if (i == vcmIndex + 1) {
            week.songs[1] = p.match(/\d+/)[0]
        }
        if (i == endIndex + 1) {
            week.songs[2] = p.match(/\d+/)[0]
        }

    })
    console.log(JSON.stringify(week));
    const div = document.createElement('div')
    div.style.position = 'absolute';
    div.style.top = '0';
    div.innerHTML = JSON.stringify(week);
    div.style.backgroundColor = 'lightBlue';
    document.body.appendChild(div);
    div.onclick = (e) => {
        var range = document.createRange();
        range.selectNode(div);
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges();// to deselect
        window.alert("Copié dans le presse-papier");
    }

}


//scrapper();

