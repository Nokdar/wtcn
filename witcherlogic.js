let uniqueEleID = 0;

const cstNameInput = document.querySelector('#NameInput');
const cstHpInput = document.querySelector('#HpInput');
const cstSubmitBtn = document.querySelector('#SubmitBtn');
const cstContMon = document.querySelector('#contMon');
const arrRed = [
document.querySelector('#RedCIn'),
document.querySelector('#RedKIn'),
document.querySelector('#RedMIn'),
document.querySelector('#RedZIn'),
document.querySelector('#RedZeIn'),
document.querySelector('#RedSrIn')
];


//new AddMonster










//funkcja addMon
const addMon = () => {
    uniqueEleID += 1;
    const monName =cstNameInput.value.trim();
    const monHp = cstHpInput.value.trim();
    if (monName === '' || monHp === '') {
        alert('Give full data.');
        return;
    }

    let selectedRed = [];
    arrRed.forEach((input) => {
        if (input.checked) {
            selectedRed.push(input.value);
        }
    });

    //tworzenie boxu
    const cstBoxMon = document.createElement('div');
    cstBoxMon.classList.add('boxMon');
    cstBoxMon.setAttribute("id", uniqueEleID);
    cstBoxMon.checkID = uniqueEleID + 100;
    cstBoxMon.selectedRed = selectedRed; 
    cstBoxMon.monName = monName; 
    cstBoxMon.monHp = monHp; 
    cstBoxMon.innerHTML = `
        <div class="subBox" style="width: 3rem;">
            <input type="radio" name="ChooseMon" id=${cstBoxMon.checkID} value="FakeMon1" style="left: 0rem;"></input>
            <p style="font-size: 0.8rem">
                #${cstBoxMon.id}
            </p>
        </div>
        <div class="subBox">

            <h3>${cstBoxMon.monName}</h3>
            <p>
            HP: ${cstBoxMon.monHp}
            </p>
            <p>
            Red: ${cstBoxMon.selectedRed.join(', ')}      
            </p>

        </div>
        <div class="subBox" style="width: 1rem; height: 1rem; font-size: 0.7rem;">
        <button id="deleteBtn" id=${cstBoxMon.checkID}>X</button>
        </div>
    `;
    cstContMon.appendChild(cstBoxMon);
    const cstDeleteBtn = cstBoxMon

    //czyszczenie pól i tablicy
    cstNameInput.value = '';
    cstHpInput.value = '';
    for (let i = 0; i < arrRed.length; i++)
    {
        arrRed[i].checked = false;
    }

 
}

const deleteBoxMon = (theID) => {
    const boxID = document.querySelector(theID);
    if (theID) {
            boxID.remove();
    }
}
cstDeleteBtn.addEventListener('click', deleteBoxMon(this.id));

/*
cstContMon.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteBtn')) {
        const parentBox = event.target.closest('.boxMon');
        if (parentBox) {
            cstContMon.removeChild(parentBox);
        }
    }
});*/

cstSubmitBtn.addEventListener('click', addMon);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addMon();
    }
});      




