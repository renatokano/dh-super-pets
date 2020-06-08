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