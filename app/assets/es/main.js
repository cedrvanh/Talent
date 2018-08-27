'use strict';

import { PostsService } from './services';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { Utils } from './utils';

class App {
  constructor () {
    console.log('Constructor of the class');
  }

  init () {
    /*
     Firebase Initialization
    */
    var config = {
      apiKey: "AIzaSyDIo8NRzh4pchSitnzUKPh1cKawZP1aGhc",
      authDomain: "talent-174ec.firebaseapp.com",
      databaseURL: "https://talent-174ec.firebaseio.com",
      projectId: "talent-174ec",
      storageBucket: "",
      messagingSenderId: "993333753781"
    }
    firebase.initializeApp(config);

    this.checkUser();
    this.checkPage();

    /*
     Navigation
    */
    const navigationOpen = document.querySelector('.navigation__open');
    const navigationClose = document.querySelector('.navigation__close');

    navigationOpen.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.navbar__side').style.transform = "translateX(0%)";
    });
    navigationClose.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.navbar__side').style.transform = "translateX(-100%)";
    });

    /*
     Binding eventlisteners to buttons
    */
    const likeBtn = document.getElementById('likeIcon');
    const viewBtn = document.getElementById('viewIcon');
    const registerBtn = document.getElementById('registerSubmit');
    const contactbtn = document.getElementById('contactSubmit');
    const signInBtn = document.getElementById('signIn');
    const signOutBtn = document.querySelector('.logout');
    const facebookBtn = document.querySelector('.facebook-login');

    if(likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        this.like();
      });
    }

    if(viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        this.view();
      });
    }

    if(contactbtn) {
      contactbtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitContactForm();
      });
    }

    if(registerBtn) {
      registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Pressed');
        this.signUp();
      });
    }
    
    if(signInBtn) {
      signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.signIn();
      }) 
    }

    if(facebookBtn) {
      facebookBtn.addEventListener('click', () => {
        console.log("Pressed");
        this.signInWithFacebook();
      });
    }

    if(signOutBtn) {
      signOutBtn.addEventListener('click', () => {
        console.log("Pressed");
        this.signOut();
      });
    }
  }

  /*
    Checks current page and runs code
  */
  checkPage() {
    const pathName = window.location.pathname;

    switch (pathName) {
      case '/projects.html':
        console.log('Projects code');
        this.loadProjects();
        break;
      case '/projectdetail.html':
      console.log('Projectdetail code');
        this.loadProjectById();
        break;
      case '/posts.html':
        console.log('Posts code');
        this.loadPosts();
        break;
      case '/postdetail.html':
        console.log('Post-detail code');
        this.loadPostById();
        break;
      case '/login.html':
        console.log('Login code');
        break;
      case '/register.html':
        console.log('Register code');
        break;
      case '/contact.html':
        console.log('Contact code');
        break;
      default:
        console.log('Default page');
        this.loadPosts();
        this.loadProjects();
    }
  }

  /*
    Handle's logged in user state
  */
  checkUser() {
    let loggedInNav = document.querySelector('.navbar__user-nav');
    let loggedOutNav = document.querySelector('.navbar__login-nav');
    let userName = document.querySelector('.username');

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log('Currently logged in ' + user.email);
        loggedInNav.style.display = "block";
        loggedOutNav.style.display = "none";
        user.displayName ? userName.innerHTML = user.displayName : userName.innerHTML = user.email;
      } else {
        loggedInNav.style.display = "none";
        loggedOutNav.style.display = "block";
      }
    });
  }

  /*
     Sign up using Firebase Authentication
  */
  signUp() {
    const email = document.getElementById('emailField');
    const password = document.getElementById('passwordField');

    //if(this.validateForm()) {
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then((user) => {
      window.location = "index.html";
    }).catch((error) => {
      window.alert(error);
    });
    //}
  }

  /*
     Sign in using Firebase Authentication
  */
  signIn() {
    const email = document.getElementById('emailField');
    const password = document.getElementById('passwordField');

    //if(this.validateForm()) {
      firebase.auth().signInWithEmailAndPassword(email.value, password.value).then((user) => {
        window.location = "index.html";
      }).catch((error) => {
        window.alert(error);
      });
    //}
  }

  /*
     Sign in with facebook using Firebase Authentication
  */
  signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then((data) => {
      console.log(data.user);
    });
  }
  
  /*
     Sign logged in user out
  */
  signOut() {
    console.log("Logging out");    
    firebase.auth().signOut();
  }

  /*
     Handles form validation and displays errors
  */
  validateForm() {
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach((input) => {
      if(input.value == "") {
        input.className += " error";
      }
    })
  }

  /*
     Handles code when contact form is submitted
  */
  submitContactForm() {
    const contactPage = document.querySelector('.contact-form');
    const contactForm = document.querySelector('.contact-form .form');
    const contactEmail = document.getElementById('contactEmail').value;
    const contactSubject = document.getElementById('contactSubject').value;
    const contactMsg = document.getElementById('contactMsg').value;
    let tempStr;

    if(contactEmail && contactSubject && contactMsg) {
      contactPage.removeChild(contactForm);
      tempStr = '<h2>Bedankt om ons te contacteren!</h2>';
      tempStr += '<p>We zullen zo snel mogelijk antwoorden op uw verzoek</p>';
      contactPage.innerHTML = tempStr;
    }
  }

  /*
     Loads projects using Firebase Realtime Database
  */
  loadProjects() {
    Utils.getJsonByPromise('../templates/project.hbs').then((templateData) => {
      const container = document.querySelector('.project-container');
      firebase.database().ref('projects').on('value', (snap) => {
        const data = snap.val();
        this.renderTemplate(templateData, data, container);      
      });
    });
  }

  /*
     Loads project by id using Firebase Realtime Database
  */
  loadProjectById() {
    Utils.getJsonByPromise('../templates/project-detail.hbs').then((templateData) => {
      const id = this.getParameterByName('id');
      const container = document.querySelector('.detail-container');
      firebase.database().ref('projects/' + id).on('value', (snap) => {
        const data = snap.val();
        this.renderTemplate(templateData, data, container);      
      });
    });
  }

  /*
     Loads posts using Firebase Realtime Database
  */
  loadPosts() {
    Utils.getJsonByPromise('../templates/post.hbs').then((templateData) => {
      const container = document.querySelector('.post-container');
      firebase.database().ref('posts').on('value', (snap) => {
        const data = snap.val();
        this.renderTemplate(templateData, data, container);      
      });
    });
  }

  /*
     Loads post by id using Firebase Realtime Database
  */
  loadPostById() {
    Utils.getJsonByPromise('../templates/post-detail.hbs').then((templateData) => {
      const id = this.getParameterByName('id');
      const container = document.querySelector('.postdetail-container');
      firebase.database().ref('posts/' + id).on('value', (snap) => {
        const data = snap.val();
        this.renderTemplate(templateData, data, container);      
      });
    });
  }

  /*
     Handlebar code for rendering templates
  */
  renderTemplate(templateData, data, container) {
    const template = Handlebars.compile(templateData);
    const html = template(data);
    container.innerHTML = html;
  }  

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /*
    Localstorage Like
  */
  like() {
    let likeStatus = false;

    switch(likeStatus) {
      case false:
        likeIcon.style.color = "red";
        likeStatus = true;
        localStorage.setItem('liked', likeStatus);
        break;
      case true: 
        likeIcon.style.color = "#ababab";
        likeStatus = false;
        localStorage.removeItem('liked');
        break;
    }
  }

  view() {
    const viewIcon = document.getElementById('viewIcon');
    const viewSpan = document.querySelector(".fa-eye");
    let views = 0;

    views++;
    viewSpan.innerHTML = views;
  }

};

window.addEventListener('load', (ev) => {
  const app = new App();
  app.init();
});
