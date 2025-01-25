const saveToLS = () => {
    const saveddata = Array.from(cstContMon.querySelectorAll('.boxMon')).map((box) => ({
        id: box.id,
        nameOfDiv: box.getAttribute("nameOfDiv"),
        valueOfCheck: box.getAttribute("valueOfCheck"),
        monHp: box.getAttribute("monHp"),
        stun: box.getAttribute("stun"),
        locArmor: box.getAttribute("locArmor"),
        locRed: box.getAttribute("locRed")
    }));
    localStorage.setItem('saveddata', JSON.stringify(saveddata));
    console.log("SAVED to local storage");
    console.log(saveddata);
};



//-----------------------------------------------------------------------------------------
const cstHpInput = document.querySelector('#HpInput');
const cstArmorInput = document.querySelector('#ArmorInput');
const cstArmorSubmitBtn = document.querySelector('#ArmorSubmitBtn');
const cstHpSubmitBtn = document.querySelector('#HpSubmitBtn');
const cstContMon = document.querySelector('#contMon');
const arrRed = [
document.querySelector('#RedCIn'),
document.querySelector('#RedKIn'),
document.querySelector('#RedMIn'),
document.querySelector('#RedZIn'),
];
console.log("arrRed: ", arrRed);


//new clearCharacter
const clearCharacter = () => {
    createLoc();
    saveToLS();
}
const cstClearBtn = document.querySelector("#ClearBtn");
cstClearBtn.addEventListener('click', () => clearCharacter());


//new createHp
const createHp = () => {
    console.log(cstHpInput, " : ", cstHpSubmitBtn);
    const divHp = document.querySelector("#HpBox");
    console.log("divHp: ", divHp);
    const theHp = cstHpInput.value.trim();
    if (theHp === '') {
        alert('Ile PZ?'); 
        return;
    }
    const newHp = parseInt(theHp, 10);
    divHp.setAttribute("monhp", newHp);
    divHp.setAttribute("stun", (newHp*2));

    divHp.querySelector("#divHpH3").innerHTML = `
        PZ: ${divHp.getAttribute("monhp")}
    `;
    divHp.querySelector("#divHpP").innerHTML = `
        PP: ${divHp.getAttribute("stun")}
    `;

    cstHpInput.value = "";
    saveToLS();
}
cstHpSubmitBtn.addEventListener('click', () => createHp());


//new addArmor
const addArmor = () => {
    const monArmor = cstArmorInput.value.trim(); //zczytuje wartość armor
    if (monArmor === '') {
        alert('Ile pancerza?'); 
        return;
    }
    let selectedRed = [];
    arrRed.forEach((input) => {
        if (input.checked) {
            selectedRed.push(input.value);
        }
    });                                         //zczytuje tablicę redukcji
    console.log("selectedRed is: ", selectedRed);

    const arrBoxMons = Array.from(cstContMon.querySelectorAll('.boxMon')); 
    console.log("arrBoxMons is: ", arrBoxMons);
    arrChecks = Array.from(cstContMon.querySelectorAll(`input[name=ChooseLoc]`)); 
    console.log("arrChecks is: ", arrChecks);

    let checkLocObj=null;
    for(let i=0; i<arrChecks.length; i++) {
        if(arrChecks[i].checked) {
            checkLocObj = arrBoxMons[i+1];
            break;
        } 
        else if(i==arrChecks.length-1) {
            checkLocObj = {id: "noLocation"};
        }
    }
    console.log("checkLocObj is: ", checkLocObj);

    if(checkLocObj.id==="noLocation") {
        console.log("NO LOCATION REPORT");
        alert("Gdzie to założyć?");
        return;
    } else {
        checkLocObj.locArmor = monArmor;
        checkLocObj.locRed = JSON.stringify(selectedRed);
        checkLocObj.setAttribute("locArmor", monArmor);
        checkLocObj.setAttribute("locRed", JSON.stringify(selectedRed));
        console.log("locRed is:", checkLocObj.locRed);
    }

    checkLocObj.querySelector(".wypDisplay").innerHTML = `
        Wyp: ${checkLocObj.locArmor}
    `;
    checkLocObj.querySelector(".redDisplay").innerHTML = `
        Red: ${JSON.parse(checkLocObj.locRed).join(", ")}
    `;

    cstArmorInput.value = "";
    arrRed.forEach((input) => {
        if (input) {
            input.checked=false;
        }
    });
    arrChecks.forEach((input) => {
        if (input) {
            input.checked=false;
        }
    });
    saveToLS();
}
cstArmorSubmitBtn.addEventListener('click', addArmor);

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
document.querySelector('#AttStIn')
];
const arrAttIgn = [
document.querySelector('#AttIgnAll'),
document.querySelector('#AttIgnHalf')
];
console.log('arrAttType: ', arrAttType);
console.log('arrAttIgn: ', arrAttIgn);


/*
1. Dzielenie Armora
2. Odejmowanie Armora od DMG
3. Mnożenie DMG przez:
    a. Redukcje
    b. Lokację

*/


//ATAK
const attackMon = () => {
    //zczywtywanie wybranych redukcji i tabel
    let chosenAttType = "";
    arrAttType.forEach((input) => {
        if (input.checked) {
            chosenAttType = input.value;
        }
    });
    console.log("chosenAttType is: ", chosenAttType);

    const arrChecks = Array.from(cstContMon.querySelectorAll(`input[name=ChooseLoc]`)); 
    console.log("arrChecks is: ", arrChecks);

    const arrBoxMons = Array.from(cstContMon.querySelectorAll('.boxMon')); 
    let chosenBoxMon = {
        id: "no",
        nameOfDiv: "no",
        valueOfCheck: "no",
        monHp: "no",
        stun: "no",
        locArmor: "no",
        locRed: "no"
    };
    for(let i=0; i<arrChecks.length; i++) {
        if(arrChecks[i].checked) {
            chosenBoxMon=arrBoxMons[i+1];
        }
    }
    console.log("chosenBoxMon is set as:", chosenBoxMon);


        //wczytywanie danych z diva
        if(chosenBoxMon.id!="no") {
            var armorV = chosenBoxMon.getAttribute("locArmor");
            console.log("armorV is: ", armorV);
            var redV = JSON.parse(chosenBoxMon.getAttribute("locRed"));
            console.log("redV is: ", redV);
        }
        
        //wczytywanie wpisanego DMG
        const firtsDmgIn = cstDmgInput.value.trim();
        if(firtsDmgIn=="") {
            alert("Ile tego zadać?");
            return;
        }
        let currDmg = parseInt(firtsDmgIn);

        //lokalizowanie div HP
        let divHp = document.querySelector("#HpBox");
        console.log("divHp is: ", divHp, " by ", document.querySelector("#HpBox"));

        //sprawdzanie ignorancji pancerza
        let IgnMultip = 1;
        arrAttIgn.forEach((input) => {
            if(input.checked) {
                if(input.value=="Half") {
                    IgnMultip=1/2;
                    console.log("IgnMultip: ", IgnMultip);
                }
                else if(input.value=="All") {
                    IgnMultip=0;
                    console.log("IgnMultip: ", IgnMultip);
                }
            }
            else {
                console.log("No Ignorance.");
            }
        });



    //mnożenie i dzielenie currDmg
    if(chosenBoxMon.id!="no") {
        armorV=armorV*IgnMultip;
        currDmg-=Math.ceil(armorV);
        console.log("DMG-Armor= ", currDmg);

        switch(chosenBoxMon.getAttribute("id")) {
            case "HeadBox":
                console.log("Aimed in Head.");
                currDmg=Math.floor(currDmg*2);
                console.log("So currDmg is: ", currDmg);
                break;
            case "CorpusBox":
                console.log("Aimed in Corpus.");
                console.log("So currDmg is: ", currDmg);
                break;
            default:
                console.log("Aimed in Limb.");
                currDmg=Math.floor(currDmg/2);
                console.log("So currDmg is: ", currDmg);
                break;
        }
    }

    let isSt = false;
    if(chosenAttType=="St") {
        isSt=true;
        console.log("Atak w PP.");
    }


    if(chosenBoxMon.id=="no") {
        if(isSt==true) {
            let finalValue=divHp.getAttribute("stun");
            finalValue-=Math.floor(currDmg);
            divHp.setAttribute("stun", finalValue);
            divHp.querySelector("#divHpP").innerHTML = `
                PP: ${divHp.getAttribute("stun")}
            `;
        }
        else {
            let finalValue=divHp.getAttribute("monHp");
            finalValue-=Math.floor(currDmg);
            divHp.setAttribute("monHp", finalValue);
            divHp.querySelector("#divHpH3").innerHTML = `
                PZ: ${divHp.getAttribute("monHp")}
            `;
        }
    }
    else {
        if(isSt==true) {    
            let finalValue=divHp.getAttribute("stun");
            finalValue-=Math.floor(currDmg);
            divHp.setAttribute("stun", finalValue);
            divHp.querySelector("#divHpP").innerHTML = `
                PZ: ${divHp.getAttribute("stun")}
            `;
        }
        else {
            for(let i=0; i<redV.length; i++) {
                if(chosenAttType==redV[i]) {
                    currDmg=Math.floor(currDmg/2);
                }
                console.log(redV[i], " => ", chosenAttType);
            }
            console.log("After red calculations currDmg is: ", currDmg);

            let finalValue=divHp.getAttribute("monHp");
            finalValue-=Math.floor(currDmg);
            divHp.setAttribute("monHp", finalValue);
            divHp.querySelector("#divHpH3").innerHTML = `
                PZ: ${divHp.getAttribute("monHp")}
            `;
        }
    }    

    cancelAttack();
    saveToLS();









/*
    let currentHp = divHp.getAttribute("stun");
        console.log("STARTING STUN: ", currentHp);
        currentHp=parseInt(currentHp);
        currentHp-=DmgIn;
        console.log("NOW STUN IS: ", currentHp);
        divHp.setAttribute("stun", (currentHp));
        divHp.querySelector("#divHpP").innerHTML = `
        PP: ${divHp.getAttribute("stun")}
        `;




        ----------------------



        let currentHp = divHp.getAttribute("monHp");
        console.log("STARTING HP: ", currentHp);
        currentHp=parseInt(currentHp);

        let chosenBoxMon = null;
        for(let i=0; i<arrBoxMons.length; i++) {
            if(arrChecks[i].checked) {
                chosenBoxMon = arrBoxMons[i+1];
                console.log("chosenBoxMon is: ", chosenBoxMon);
                break;
            } 
            else if(i==arrBoxMons.length-1) {
                alert('W co uderzyć?');
                return;
            }

            //console.log("locRed: ", chosenBoxMon.getAttribute("locRed"));
            //const chosenReds = JSON.parse(chosenBoxMon.getAttribute("locRed")).join(", ");
            //console.log("chosenReds: ", chosenReds);





            currentHp-=DmgIn;
            console.log("NOW HP IS: ", currentHp);
            divHp.setAttribute("monHp", currentHp);
            console.log("divHpH3: ", divHp.querySelector("#divHpH3"));
            divHp.querySelector("#divHpH3").innerHTML = `
                PZ: ${divHp.getAttribute("monHp")}
            `;
*/






    /*
    //TYPY ATAKU

    const arrCstBoxMons = [];
    

    const arrChecks = [];
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
    console.log("Following reductions has been chosen for dataele: ", chosenReds);

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
    */
}
cstAttackBtn.addEventListener('click', attackMon);



const healMon = () => {
    const firtsDmgIn = cstDmgInput.value.trim();
    if(firtsDmgIn=="") {
        alert("Ile tego wyleczyć?");
        return;
    }
    const DmgIn = parseInt(firtsDmgIn);
    const divHp = document.querySelector("#HpBox");
    console.log("divHp is: ", divHp, " by ", document.querySelector("#HpBox"));

    let chosenAttType = "";
    arrAttType.forEach((input) => {
        if (input.checked) {
            chosenAttType = input.value;
        }
    });
    console.log("chosenAttType is: ", chosenAttType);

    if(chosenAttType=="St") {
        let currentHp = divHp.getAttribute("stun");
        console.log("STARTING STUN: ", currentHp);
        currentHp=parseInt(currentHp);
        currentHp+=DmgIn;
        console.log("NOW STUN IS: ", currentHp);
        divHp.setAttribute("stun", (currentHp));
        divHp.querySelector("#divHpP").innerHTML = `
        PP: ${divHp.getAttribute("stun")}
        `;
    } 
    else {
        let currentHp = divHp.getAttribute("monHp");
        console.log("STARTING HP: ", currentHp);
        currentHp=parseInt(currentHp);
        currentHp+=DmgIn;
        console.log("NOW HP IS: ", currentHp);
        divHp.setAttribute("monHp", currentHp);
        console.log("divHpH3: ", divHp.querySelector("#divHpH3"));
        divHp.querySelector("#divHpH3").innerHTML = `
            PZ: ${divHp.getAttribute("monHp")}
        `;
    }

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
    for (let i = 0; i < arrAttIgn.length; i++)
    {
        arrAttIgn[i].checked = false;
    }
    arrChecks = Array.from(cstContMon.querySelectorAll(`input[name=ChooseLoc]`)); 
    for (let i = 0; i < arrChecks.length; i++)
    {
        arrChecks[i].checked = false;
    }
}
cstCancelBtn.addEventListener('click', cancelAttack);




//----------------------------------------------------------------------------------------
const createLoc = () => {
    const divHp = document.querySelector("#HpBox");
    divHp.setAttribute("monHp", 0);
    divHp.setAttribute("stun", 0);
    divHp.setAttribute("nameOfDiv", "PZ");
    divHp.innerHTML=`
        <h3 id="divHpH3">PZ: ${divHp.getAttribute("monHp")}</h3>
        <p id="divHpP" style="font-size: 0.7rem;">PP: ${divHp.getAttribute("stun")}</p>
    `;

    const divHead = document.querySelector("#HeadBox");
    divHead.setAttribute("locArmor", 0);
    divHead.setAttribute("locRed", JSON.stringify([]));
    divHead.setAttribute("nameOfDiv", "Głowa");
    divHead.setAttribute("valueOfCheck", "H");
    divHead.innerHTML = `
        <input type="radio" name="ChooseLoc" id="radioHead" value="H"></input>
        <h4><b>Głowa</b></h4>
        <p class="wypDisplay">Wyp: ${divHead.getAttribute("locArmor")}</p>
        <p class="redDisplay">Red: ${JSON.parse(divHead.getAttribute("locRed")).join(", ")}</p>
    `;

    const divAR = document.querySelector("#ARBox");
    divAR.setAttribute("locArmor", 0);
    divAR.setAttribute("locRed", JSON.stringify([]));
    divAR.setAttribute("nameOfDiv", "RP");
    divAR.setAttribute("valueOfCheck", "AR");
    divAR.innerHTML = `
        <input type="radio" name="ChooseLoc" id="radioAR" value="AR"></input>  
        <h4><b>RP</b></h4>
        <p class="wypDisplay">Wyp: ${divAR.getAttribute("locArmor")}</p>
        <p class="redDisplay">Red: ${JSON.parse(divAR.getAttribute("locRed")).join(", ")}</p>
    `;
    const divCorpus = document.querySelector("#CorpusBox");
    divCorpus.setAttribute("locArmor", 0);
    divCorpus.setAttribute("locRed", JSON.stringify([]));
    divCorpus.setAttribute("nameOfDiv", "Korpus");
    divCorpus.setAttribute("valueOfCheck", "C");
    divCorpus.innerHTML = `
        <input type="radio" name="ChooseLoc" id="radioCorpus" value="C"></input>  
        <h4><b>Korpus</b></h4>
        <p class="wypDisplay">Wyp: ${divCorpus.getAttribute("locArmor")}</p>
        <p class="redDisplay">Red: ${JSON.parse(divCorpus.getAttribute("locRed")).join(", ")}</p>
    `;

    const divAL = document.querySelector("#ALBox");
    divAL.setAttribute("locArmor", 0);
    divAL.setAttribute("locRed", JSON.stringify([]));
    divAL.setAttribute("nameOfDiv", "RL");
    divAL.setAttribute("valueOfCheck", "AL");
    divAL.innerHTML = `
        <input type="radio" name="ChooseLoc" id="radioAL" value="AL"></input>  
        <h4><b>RL</b></h4>
        <p class="wypDisplay">Wyp: ${divAL.getAttribute("locArmor")}</p>
        <p class="redDisplay">Red: ${JSON.parse(divAL.getAttribute("locRed")).join(", ")}</p>
    `;

    const divLR = document.querySelector("#LRBox");
    divLR.setAttribute("locArmor", 0);
    divLR.setAttribute("locRed", JSON.stringify([]));
    divLR.setAttribute("nameOfDiv", "NP");
    divLR.setAttribute("valueOfCheck", "LR");
    divLR.innerHTML = `
        <input type="radio" name="ChooseLoc" id="radioLR" value="LR"></input>  
        <h4><b>NP</b></h4>
        <p class="wypDisplay">Wyp: ${divLR.getAttribute("locArmor")}</p>
        <p class="redDisplay">Red: ${JSON.parse(divLR.getAttribute("locRed")).join(", ")}</p>
    `;

    const divLL = document.querySelector("#LLBox");
    divLL.setAttribute("locArmor", 0);
    divLL.setAttribute("locRed", JSON.stringify([]));
    divLL.setAttribute("nameOfDiv", "NL");
    divLL.setAttribute("valueOfCheck", "LL");
    divLL.innerHTML = `
        <input type="radio" name="ChooseLoc" id="radioLL" value="LL"></input>  
        <h4><b>NL</b></h4>
        <p class="wypDisplay">Wyp: ${divLL.getAttribute("locArmor")}</p>
        <p class="redDisplay">Red: ${JSON.parse(divLL.getAttribute("locRed")).join(", ")}</p>
    `;

    console.log("Value of HP of new generated Character is:", divHp.getAttribute("monHp"));
}

const loadFromLS = () => {
    const saveddata = JSON.parse(localStorage.getItem('saveddata')) || "no";
    if(saveddata==="no") {
        console.log('No data found. Creating new Objects. saveddata: ', saveddata);
        createLoc();
    }
    else {
        console.log("saveddata is: ", saveddata);
        saveddata.forEach((dataele) => {
            const theDivID = document.querySelector(`#${dataele.id}`);
            console.log("divHp if is: ", dataele.id);
            console.log("the chosen div is: ", theDivID);

            theDivID.setAttribute("nameOfDiv", dataele.nameOfDiv);
            console.log(theDivID.getAttribute("nameOfDiv"));
            theDivID.setAttribute("monHp", dataele.monHp);
            console.log(theDivID.getAttribute("monHp"));
            theDivID.setAttribute("stun", dataele.stun);
            console.log(theDivID.getAttribute("stun"));
            theDivID.setAttribute("locArmor", dataele.locArmor);
            console.log(theDivID.getAttribute("locArmor"));
            theDivID.setAttribute("locRed", dataele.locRed);
            console.log(theDivID.getAttribute("locRed"));

            if(dataele.id==="HpBox") {
                theDivID.innerHTML=`
                    <h3 id="divHpH3">PZ: ${theDivID.getAttribute("monHp")}</h3>
                    <p id="divHpP" style="font-size: 0.7rem;">PP: ${theDivID.getAttribute("stun")}</p>
                `;
            }
            else {
                theDivID.innerHTML = `
                    <input type="radio" name="ChooseLoc" id="${theDivID.id}" value="${theDivID.valueOfCheck}"></input>  
                    <h4><b>${theDivID.getAttribute("nameofdiv")}</b></h4>
                    <p class="wypDisplay">Wyp: ${theDivID.getAttribute("locArmor")}</p>
                    <p class="redDisplay">Red: ${JSON.parse(theDivID.getAttribute("locRed")).join(", ")}</p>
                `;
            }
        });
    };
    console.log("||  - - -   LOADING FINISHED   - - -  ||");
}
loadFromLS();