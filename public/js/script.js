function openUserTabs(e, tabName){
  var i, tabs, tabLinks;
  tabs = document.getElementsByClassName("uap-tabs");
  for(i=0; i<tabs.length; i++){
    tabs[i].style.display = 'none';
  }
  tabLinks = document.getElementsByClassName("tabLinks");
  for(i=0; i<tabs.length; i++){
    tabLinks[i].style.fontWeight = 'normal';
  }
  console.log(`tabName: ${tabName}`);
  document.getElementById(tabName).style.display="grid";
  e.currentTarget.style.fontWeight = 'bold';
}

function openProfessionalsTabs(e, tabName){
  var i, tabs, tabLinks;
  tabs = document.getElementsByClassName("pap-tabs");
  for(i=0; i<tabs.length; i++){
    tabs[i].style.display = 'none';
  }
  tabLinks = document.getElementsByClassName("tabLinks");
  for(i=0; i<tabs.length; i++){
    tabLinks[i].style.fontWeight = 'normal';
  }
  console.log(`tabName: ${tabName}`);
  document.getElementById(tabName).style.display="grid";
  e.currentTarget.style.fontWeight = 'bold';
}

async function petCompleteForm(petId, uuid){ 
  // API call
  let res = await fetch(`/users/${uuid}/pets`);
  let user = await res.json();

  // get the pet selected
  let pet = user.Pets.filter(pet => {
    return pet.id == petId;
  });

  console.log(pet);
  
  // fill in the fields
  document.getElementById("editMyPets__id").value = pet[0].id
  document.getElementById("editMyPets__name").value = pet[0].name
  document.getElementById("editMyPets__birth").value = pet[0].birth
  document.getElementById("editMyPets__breed").value = pet[0].breed
  document.getElementById("editMyPets__pet_type_id").value = pet[0].pet_type_id
  document.getElementById("editMyPets__vaccinated").checked = pet[0].vaccinated
  document.getElementById("editMyPets__castrated").checked = pet[0].castrated
  document.getElementById("editMyPets__notes").value = pet[0].notes
}

const loginMenu = function(){
  let loginBtn = document.getElementById('header-nav__link--login');
  let loginDropdown = document.getElementById('header-nav__dropdown-login');
  if(loginBtn){
    loginBtn.addEventListener('click', function(){
      loginDropdown.classList.toggle('header-nav__dropdown-login--active');
    });
  }
}

// newsletter API call
let newsletterSubmit = async function(event){
  let res = await fetch('/newsletter/'+newsletterEmail.value);
  location.reload();  
}

let newsletterEmail = document.getElementById('newsletter__register-email');
newsletterEmail.addEventListener('keyup', function(event){
  let key = event.which || event.keyCode;
  if (key == 13) newsletterSubmit(); // Enter button
});

let newsletterEmailSubmit = document.getElementById('newsletter__register--submit');
newsletterEmailSubmit.addEventListener('click', newsletterSubmit);


//show menu mobile
document.querySelector('.hamburger-menu').addEventListener('click',()=>{
  document.querySelector('.nav-mobile').className ='nav-mobile--active'; 
});

//hide menu mobile
document.querySelector('.nav-mobile__item--close-icon').addEventListener('click',()=>{
  document.querySelector('.nav-mobile--active').className ='nav-mobile';
});

//home search checkbox custom buttons
const searchButton1 = () =>{
  let btn1 = document.getElementById('btn-1');
  let dogTraining = document.querySelector('.home-dog-training');
  let dogTrainingBtn = document.querySelector('.dog-training-btn');
  
  if(dogTrainingBtn){
    dogTrainingBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1593329216/dog-training_pw3jp1.svg')";
    btn1.addEventListener('click',()=>{
      if(btn1.checked){
        dogTraining.style.border='none';
        dogTrainingBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1592952153/dog-training-checked_kuxzfh.svg')";
        dogTrainingBtn.style.color='#fff';  
      }else{
        dogTraining.style.border='2px solid #ebeded';
        dogTrainingBtn.style.backgroundImage='none';
        dogTrainingBtn.style.color='#676767';
      }
    })  
  }
    
}

const searchButton2 = () =>{
  let btn2 = document.getElementById('btn-2');
  let petShower = document.querySelector('.home-pet-shower');
  let petShowerBtn = document.querySelector('.pet-shower-btn');
    
  if(petShowerBtn){
    petShowerBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1593329216/shower-icon_ok5b49.svg')";
    btn2.addEventListener('click',()=>{
      if(btn2.checked){
        petShower.style.border='none';
        petShowerBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1592952106/shower-icon-checked_dfmqag.svg')";
        petShowerBtn.style.color='#fff';  
      }else{
        petShower.style.border='2px solid #ebeded';
        petShowerBtn.style.backgroundImage='none';
        petShowerBtn.style.color='#676767';
      }
    })   
  }
   
}

const searchButton3 = () =>{
  let btn3 = document.getElementById('btn-3');
  let dogSitter = document.querySelector('.home-dog-sitter');
  let dogSitterBtn = document.querySelector('.dog-sitter-btn');
   
  if(dogSitterBtn){
    dogSitterBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1593329216/dog-sitting_isgqic.svg')";
    btn3.addEventListener('click',()=>{
      if(btn3.checked){
        dogSitter.style.border='none';
        dogSitterBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1592952153/dog-sitting-checked_bpy3js.svg')";
        dogSitterBtn.style.color='#fff';  
      }else{
        dogSitter.style.border='2px solid #ebeded';
        dogSitterBtn.style.backgroundImage='none';
        dogSitterBtn.style.color='#676767';
      }
    })    
  }
 
}

const searchButton4 = () =>{
  let btn4 = document.getElementById('btn-4');
  let dogWalk = document.querySelector('.home-dog-walk');
  let dogWalkBtn = document.querySelector('.dog-walk-btn');
    
  if(dogWalkBtn){
    dogWalkBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1593329216/dog-running_kpbxdt.svg')";
    btn4.addEventListener('click',()=>{
      if(btn4.checked){
        dogWalk.style.border='none';
        dogWalkBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1592952152/dog-running-checked_nbdjoe.svg')";
        dogWalkBtn.style.color='#fff';  
      }else{
        dogWalk.style.border='2px solid #ebeded';
        dogWalkBtn.style.backgroundImage='none';
        dogWalkBtn.style.color='#676767';
      }
    })  
  }
    
}

const searchButton5 = () =>{
  let btn5 = document.getElementById('btn-5');
  let dogGroom = document.querySelector('.home-dog-groom');
  let dogGroomBtn = document.querySelector('.dog-groom-btn');
    
  if(dogGroomBtn){
    dogGroomBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1593329216/scissor-icon_hbe2m5.svg')";
    btn5.addEventListener('click',()=>{
      if(btn5.checked){
        dogGroom.style.border='none';
        dogGroomBtn.style.backgroundImage="url('https://res.cloudinary.com/superpets/image/upload/v1592952105/scissor-icon-checked_lrgejb.svg')";
        dogGroomBtn.style.color='#fff';  
      }else{
        dogGroom.style.border='2px solid #ebeded';
        dogGroomBtn.style.backgroundImage='none';
        dogGroomBtn.style.color='#676767';
      }
    }) 
  }
     
}

loginMenu();
searchButton1();
searchButton2();
searchButton3();
searchButton4();
searchButton5();