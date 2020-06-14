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


//show menu mobile
document.querySelector('.hamburger-menu').addEventListener('click',()=>{
  document.querySelector('.nav-mobile').className ='nav-mobile--active'; 
});
//hide menu mobile
document.querySelector('.nav-mobile__item--close-icon').addEventListener('click',()=>{
  document.querySelector('.nav-mobile--active').className ='nav-mobile';
});

