const saveToLS = () => {
    const monsters = Array.from(cstContMon.querySelectorAll('.boxMon')).map((box) => ({
        id: box.id,
        monName: box.monName,
        monHp: box.monHp,
        monArmor: box.monArmor,
        selectedRed: box.selectedRed,
        deleteID: box.deleteID,
        checkID: box.checkID,
    }));
    localStorage.setItem('monsters', JSON.stringify(monsters));
    console.log("SAVED to local storage");
};



//-----------------------------------------------------------------------------------------
let globID = 0;

const cstNameInput = document.querySelector('#NameInput');
const cstHpInput = document.querySelector('#HpInput');
const cstArmorInput = document.querySelector('#ArmorInput');
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


//new deleteBoxMon
const deleteBoxMon = (theID) => {
    const boxID = cstContMon.querySelector(`#${theID}`);
    boxID.remove();
    saveToLS();
}


//new addMonster
const addMonster = () => {

    const monName =cstNameInput.value.trim();
    const monHp = cstHpInput.value.trim();
    const monArmor = cstArmorInput.value.trim();
    if (monName === '' || monHp === '' || monArmor === '') {
        alert('Wincyj informacyji!');
        return;
    }
    let selectedRed = [];
    arrRed.forEach((input) => {
        if (input.checked) {
            selectedRed.push(input.value);
        }
    });



    globID++;
    const cstBoxMon = document.createElement('div');
    cstBoxMon.classList.add('boxMon');
    cstBoxMon.setAttribute('id', `NR${globID}`);
    const deleteID = `deleteBtn-${globID}`;
    const checkID = `checkID-${globID}`;

    cstBoxMon.selectedRed = selectedRed; 
    cstBoxMon.monName = monName; 
    cstBoxMon.monHp = parseInt(monHp, 10); 
    cstBoxMon.deleteID = deleteID.trim();
    cstBoxMon.checkID = checkID;
    cstBoxMon.monArmor = parseInt(monArmor, 10); 
    cstBoxMon.innerHTML = `
        <div class="subBox" style="width: 3rem;">
            <input type="radio" name="ChooseMon" id="${checkID}" value="${checkID}" style="left: 0rem;"></input>
            <p style="font-size: 0.8rem">
                ${cstBoxMon.id}
            </p>
        </div>
        <div class="subBox">
            <h3>${cstBoxMon.monName}</h3>
            <p>PZ: ${cstBoxMon.monHp}</p>
            <p>Wyp: ${cstBoxMon.monArmor}</p>
            <p>Red: ${cstBoxMon.selectedRed.join(', ')}</p>

        </div>
        <div class="subBox" style="width: 1rem; height: 1rem; font-size: 0.7rem;">
        <button id=${deleteID} class="deleteBtn">X</button>
        </div>
    `;
    console.log('Assigned checkID:', checkID);

    cstContMon.appendChild(cstBoxMon);
    const cstDeleteBtn = cstBoxMon.querySelector(`#${deleteID}`);
    cstDeleteBtn.addEventListener('click', () => deleteBoxMon(cstBoxMon.id));

    cstNameInput.value = '';
    cstHpInput.value = '';
    cstArmorInput.value = '';
    for (let i = 0; i < arrRed.length; i++)
    {
        arrRed[i].checked = false;
    }
    saveToLS();
}
//EventListener addMonster
cstSubmitBtn.addEventListener('click', addMonster);

//---------------------------------------------------------------------------------

const cstAttackBtn = document.querySelector("#attackBtn");
const cstHealBtn = document.querySelector("#healBtn");
const cstCancelBtn = document.querySelector("#cancelBtn");
const cstDmgInput = document.querySelector("#DmgInput");
const arrAttType = [
document.querySelector('#AttCIn'),
document.querySelector('#AttKIn'),
document.querySelector('#AttMIn'),
document.querySelector('#AttZIn'),
];
const arrAttMetal = [
document.querySelector('#AttZeIn'),
document.querySelector('#AttSrIn')
];
const arrAttIgn = [
document.querySelector('#AttIgnAll'),
document.querySelector('#AttIgnHalf')
];
const arrAttLoc = [
document.querySelector('#radioHead'),
document.querySelector('#radioArmR'),
document.querySelector('#radfioCorpus'),
document.querySelector('#radioArmL'),
document.querySelector('#radioLegR'),
document.querySelector('#radioLegL')
];
console.log('arrAttType: ', arrAttType);
console.log('arrAttMetal: ', arrAttMetal);
console.log('arrAttIgn: ', arrAttIgn);
console.log('arrAttLoc: ', arrAttLoc);

//ATAK
const attackMon = () => {
    //TYPY ATAKU
    const arrChecks = [];
    const arrBoxMons = Array.from(cstContMon.querySelectorAll('.boxMon')); 
    const arrCstBoxMons = [];

    arrBoxMons.forEach((box) => {
        const radio = box.querySelector('input[type="radio"][name="ChooseMon"]');
        if (radio) {
            arrChecks.push(radio);

            const cstBoxMon = box;
            arrCstBoxMons.push(cstBoxMon);
        }
    });
    console.log('radios:', arrChecks);
    console.log('divs: ', arrBoxMons);
    console.log('cstBoxMon objects:', arrCstBoxMons);

    let checkBoxMonID='';
    let selectedCstBoxMon = null;
    for(let i=0; i<arrBoxMons.length; i++) {
        if(arrChecks[i].checked) {
            checkBoxMonID = arrBoxMons[i];
            selectedCstBoxMon = arrCstBoxMons[i];
            break;
        } 
        else if(i==arrBoxMons.length-1) {
            alert('Komu to zadać?');
            return;
        }
    }
    console.log('Selected BoxMon ID:', checkBoxMonID);
    console.log('Selected CstBoxMon Object:', selectedCstBoxMon);

    const DmgIn = cstDmgInput.value.trim();
    if (DmgIn === '') {
        alert('Ile tego zadać?');
        return;
    }

    //defacto atak
    let countedDmg = parseInt(DmgIn, 10);
    
    let attIgn='';
    arrAttIgn.forEach((input)=>{
       if(input.checked) {
            attIgn = input.value;
        }
    });
    console.log("Following Armor Ignoring option has been chosen: ", attIgn); 
    switch(attIgn){
    case 'All':
        console.log("All Armor Ignored. countedDmg is now: ", countedDmg);
        break;
    case 'Half':
        countedDmg-=Math.floor(selectedCstBoxMon.monArmor/2);
        console.log("Half Armor Ignored. countedDmg is now: ", countedDmg);
        break;
    default:
        countedDmg-=selectedCstBoxMon.monArmor;
        console.log("countedDmg with Armor counted is: ", countedDmg);
        break;
    }


    let chosenReds=[];
    let attReds=[];
    let attMetal=[];
    console.log('selectedCstBoxMon.selectedRed: ', selectedCstBoxMon.selectedRed)

    chosenReds=selectedCstBoxMon.selectedRed;
    console.log("Following reductions has been chosen for monster: ", chosenReds);

    arrAttType.forEach((input)=>{
       if(input.checked) {
            attReds.push(input.value);
        }
    });
    console.log("Following reductions has been attacked: ", attReds); 

    arrAttMetal.forEach((input)=>{
       if(input.checked) {
            attMetal.push(input.value);
        }
    });
    console.log("Following metal has been attacked: ", attMetal); 

    for(let i=0; i<attReds.length; i++) {
        for(let j=0; j<chosenReds.length; j++) { 
            if(chosenReds[j]===attReds[i]) {
                countedDmg=Math.floor(countedDmg/2);
                console.log("(type) countedDmg now is: ", countedDmg);
            }
        }
    }

    for(let i=0; i<attMetal.length; i++) {
        for(let j=0; j<chosenReds.length; j++) { 
            if(chosenReds[j]===attMetal[i]) {
                countedDmg=Math.floor(countedDmg/2);
                console.log("(metal) countedDmg now is: ", countedDmg);
            }
        }
    }

    let attLoc='';
    arrAttLoc.forEach((input)=>{
       if(input.checked) {
            attLoc = input.value;
        }
    });
    console.log("Following Attack Location has been chosen: ", attLoc); 
    switch(attLoc){
    case 'H':
        countedDmg=Math.floor(countedDmg*2);
        console.log("Head value is: ", attLoc, "This mutiplies the countedDmg by 2 making it: ", countedDmg);
        break;
    case 'AR':
        countedDmg=Math.floor(countedDmg/2);
        console.log("Right arm value is: ", attLoc, "This divides the countedDmg by 2 making it: ", countedDmg);
        break;
    case 'C':
        console.log("Corpus value is: ", attLoc, "Corpus multiplier is x1 making countedDmg: ", countedDmg);
        break;
    case 'AL':
        countedDmg=Math.floor(countedDmg/2);
        console.log("Left arm value is: ", attLoc, "This divides the countedDmg by 2 making it: ", countedDmg);
        break;
    case 'LR':
        countedDmg=Math.floor(countedDmg/2);
        console.log("Right leg value is: ", attLoc, "This divides the countedDmg by 2 making it: ", countedDmg);
        break;
    case 'LL':
        countedDmg=Math.floor(countedDmg/2);
        console.log("Left leg value is: ", attLoc, "This divides the countedDmg by 2 making it: ", countedDmg);
        break;
    default:
        
        console.log("No Attack Location chosen. Default multiplier is x1. Damage equals now: ", countedDmg);
        break;
    }



    selectedCstBoxMon.monHp -= countedDmg;
    console.log('monHp = ', selectedCstBoxMon.monHp);





    //zmiana wyswietlania hp
    checkBoxMonID.innerHTML=`
        <div class="subBox" style="width: 3rem;">
            <input type="radio" name="ChooseMon" id="${selectedCstBoxMon.checkID}" value="${selectedCstBoxMon.checkID}" style="left: 0rem;"></input>
            <p style="font-size: 0.8rem">
                ${selectedCstBoxMon.id}
            </p>
        </div>
        <div class="subBox">

            <h3>${selectedCstBoxMon.monName}</h3>
            <p>PZ: ${selectedCstBoxMon.monHp}</p>
            <p>Wyp: ${selectedCstBoxMon.monArmor}</p>
            <p>Red: ${selectedCstBoxMon.selectedRed.join(', ')}</p>

        </div>
        <div class="subBox" style="width: 1rem; height: 1rem; font-size: 0.7rem;">
        <button id=${selectedCstBoxMon.deleteID} class="deleteBtn">X</button>
        </div>
    `;
    const cstDeleteBtn = selectedCstBoxMon.querySelector(`#${selectedCstBoxMon.deleteID}`);
    cstDeleteBtn.addEventListener('click', () => deleteBoxMon(selectedCstBoxMon.id));


    cancelAttack();
    saveToLS();
}
cstAttackBtn.addEventListener('click', attackMon);



const healMon = () => {
    const arrChecks = [];
    const arrBoxMons = Array.from(cstContMon.querySelectorAll('.boxMon')); 
    const arrCstBoxMons = [];

    arrBoxMons.forEach((box) => {
        const radio = box.querySelector('input[type="radio"][name="ChooseMon"]');
        if (radio) {
            arrChecks.push(radio);

            const cstBoxMon = box;
            arrCstBoxMons.push(cstBoxMon);
        }
    });
    console.log('radios:', arrChecks);
    console.log('divs: ', arrBoxMons);
    console.log('cstBoxMon objects:', arrCstBoxMons);

    let checkBoxMonID='';
    let selectedCstBoxMon = null;
    for(let i=0; i<arrBoxMons.length; i++) {
        if(arrChecks[i].checked) {
            checkBoxMonID = arrBoxMons[i];
            selectedCstBoxMon = arrCstBoxMons[i];
            break;
        } 
        else if(i==arrBoxMons.length-1) {
            alert('Komu to zadać?');
            return;
        }
    }
    console.log('Selected BoxMon ID:', checkBoxMonID);
    console.log('Selected CstBoxMon Object:', selectedCstBoxMon);

    const DmgIn = cstDmgInput.value.trim();
    if (DmgIn === '') {
        alert('Ile tego zadać?');
        return;
    }

    //defacto leczenie
    selectedCstBoxMon.monHp += parseInt(DmgIn, 10);
    console.log('monHp = ', selectedCstBoxMon.monHp);

    //zmiana wyswietlania hp
    checkBoxMonID.innerHTML=`
        <div class="subBox" style="width: 3rem;">
            <input type="radio" name="ChooseMon" id="${selectedCstBoxMon.checkID}" value="${selectedCstBoxMon.checkID}" style="left: 0rem;"></input>
            <p style="font-size: 0.8rem">
                ${selectedCstBoxMon.id}
            </p>
        </div>
        <div class="subBox">

            <h3>${selectedCstBoxMon.monName}</h3>
            <p>PZ: ${selectedCstBoxMon.monHp}</p>
            <p>Wyp: ${selectedCstBoxMon.monArmor}</p>
            <p>Red: ${selectedCstBoxMon.selectedRed.join(', ')}</p>

        </div>
        <div class="subBox" style="width: 1rem; height: 1rem; font-size: 0.7rem;">
        <button id=${selectedCstBoxMon.deleteID} class="deleteBtn">X</button>
        </div>
    `;
    const cstDeleteBtn = selectedCstBoxMon.querySelector(`#${selectedCstBoxMon.deleteID}`);
    cstDeleteBtn.addEventListener('click', () => deleteBoxMon(selectedCstBoxMon.id));

    cancelAttack();
    saveToLS();
}
cstHealBtn.addEventListener('click', healMon);



const cancelAttack = () => {
    cstDmgInput.value = '';
    for (let i = 0; i < arrAttType.length; i++)
    {
        arrAttType[i].checked = false;
    }
    for (let i = 0; i < arrAttMetal.length; i++)
    {
        arrAttMetal[i].checked = false;
    }
    for (let i = 0; i < arrAttIgn.length; i++)
    {
        arrAttIgn[i].checked = false;
    }
    for (let i = 0; i < arrAttLoc.length; i++)
    {
        arrAttLoc[i].checked = false;
    }
}
cstCancelBtn.addEventListener('click', cancelAttack);

//----------------------------------------------------------------------------------------
const loadFromLS = () => {
    const monsters = JSON.parse(localStorage.getItem('monsters')) || [];
    monsters.forEach((monster) => {
        globID++;
        const cstBoxMon = document.createElement('div');
        cstBoxMon.classList.add('boxMon');
        cstBoxMon.setAttribute('id', monster.id);
        cstBoxMon.monName = monster.monName;
        cstBoxMon.monHp = monster.monHp;
        cstBoxMon.monArmor = monster.monArmor;
        cstBoxMon.selectedRed = monster.selectedRed;
        cstBoxMon.deleteID = monster.deleteID;
        cstBoxMon.checkID = monster.checkID;

        cstBoxMon.innerHTML = `
            <div class="subBox" style="width: 3rem;">
                <input type="radio" name="ChooseMon" id="${monster.checkID}" value="${monster.checkID}" style="left: 0rem;"></input>
                <p style="font-size: 0.8rem">
                    ${monster.id}
                </p>
            </div>
            <div class="subBox">
                <h3>${monster.monName}</h3>
                <p>PZ: ${monster.monHp}</p>
                <p>Wyp: ${monster.monArmor}</p>
                <p>Red: ${monster.selectedRed.join(', ')}</p>
            </div>
            <div class="subBox" style="width: 1rem; height: 1rem; font-size: 0.7rem;">
            <button id=${monster.deleteID} class="deleteBtn">X</button>
            </div>
        `;

        cstContMon.appendChild(cstBoxMon);
        const cstDeleteBtn = cstBoxMon.querySelector(`#${monster.deleteID}`);
        cstDeleteBtn.addEventListener('click', () => {
            deleteBoxMon(monster.id);
        });
    });
};
loadFromLS();