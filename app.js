
import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc, db, getDoc, updateDoc, storage, ref, uploadBytesResumable, getDownloadURL, reauthenticateWithCredential, EmailAuthProvider, updatePassword, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc} from "./firebase-config.js";


let flag = true;
let profilePic = document.getElementById("user-profile");
let spinner = document.getElementById("spinner")

const getCurrentUserData = async (uid) => {
  
spinner.style.display = "block"
console.log("uid in get current user data", uid)
    const docRef = doc(db, "user", uid);

    
    let fullName = document.getElementById("fullName");
    let email = document.getElementById("email");
    let userName = document.getElementById("user-name");
    let userUid = document.getElementById("user-uid");

const docSnap = await getDoc(docRef);


if (docSnap.exists()) {
    if(location.pathname === "/dashboard.html" || location.pathname === "/blogs.html" ){
        userName.innerHTML = docSnap.data().name;
        
        
        
        
    }
    else{
      console.log('docSnap.data().picture==>',docSnap.data().profilePic)
        fullName.value = docSnap.data().name;
        email.value = docSnap.data().email;
        userUid.value = docSnap.id;
        profilePic.src = docSnap.data().profilePic;
        console.log("Document get current user data:", docSnap.data());
          spinner.style.display = "none"

        
    }
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document! in current user");
  spinner.style.display = "none"
}
}

//======== getting docs to show data on blogs.html means all blogs page =============

const getAllBlogs = async () => {

  let allBlogsDiv = document.getElementById("all-blogs-container")
  spinner.style.display = "block";
  const querySnapshot = await getDocs(collection(db, "blogs"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  if(location.pathname === "/blogs.html"  ){

    allBlogsDiv.innerHTML +=
    `
    <div class="mt-4 mb-2">
    <div class="head-blog mt-2">
      <div class="card border border-secondary-subtle rounded py-2">
      <div class="card-header d-flex gap-4">
          <img class="blog-avatar my-blog-pic m-0"
          src="${doc.data().user.profilePic ? doc.data().user.profilePic : './images/user.png'}"
                        alt=""><br>
                        <span class="d-flex flex-column justify-content-end">
              
                        <h6 class="card-subtitle text-body-secondary"> ${doc.data().user.name} -${doc.data().time.toDate().toDateString()}</h6>
                        <h5 class="card-title mb-3">${doc.data().title}</h5>
                        </span>
                        </div>
                        <div class="card-body">
                        <p class="card-text"> ${doc.data().description}</p>
                        
                        </div>
                        </div>
                        </div>
                        </div>
                        `
                        
                      }
                      });
                      spinner.style.display = "none";
}


//============ getting current user blog in this function =======================
const getCurrentUserBlog = async (uid) => {
  
  let myBlogs = document.getElementById("my-blogs")
  if(myBlogs){

    myBlogs.innerHTML = "";
  };

  const q = query(collection(db, "blogs"), where("uid", "==", uid));
  spinner.style.display = "block";
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  
  console.log(doc.id, " => ", doc.data());
  if(location.pathname === "/dashboard.html" )
  {

    myBlogs.innerHTML += `
    <div class="mt-2 mb-2">
  <div class="head-blog mt-2">
      <div class="card border border-secondary-subtle rounded py-2">
          <div class="card-header d-flex gap-4">
          <img class="blog-avatar my-blog-pic m-0"
                        src="${doc.data().user.profilePic ? doc.data().user.profilePic :'./images/user.png'}"
                        alt=""><br>
                        <span class="d-flex flex-column justify-content-end">
              
                        <h6 class="card-subtitle text-body-secondary"> ${doc.data().user.name}  -${doc.data().time.toDate().toDateString()}</h6>
              <h5 class="card-title mb-3">${doc.data().title}</h5>
              </span>
          </div>
          <div class="card-body">
          <p class="card-text"> ${doc.data().description}</p>
          <a href="javascript:void(0)" class="card-link btn btn-danger seeAll" onclick="deleteBlog('${doc.id}')">Delete</a>
          <a href="javascript:void(0)" class="card-link btn btn-warning seeAll" onclick="editBlog('${doc.id}', '${doc.data().title}', '${doc.data().description}')">Edit</a>
          </div>
          </div>
          </div>
          </div>
          `
        }

});
spinner.style.display = "none";
}



onAuthStateChanged(auth, (user) => {
    
    if (user) {
        getCurrentUserData(user.uid)
         

           getCurrentUserBlog(user.uid);
         
        getAllBlogs()
        if(location.pathname !== "/dashboard.html" && flag && location.pathname !== "/index.html" && location.pathname !== "/blogs.html" )  {
            location.href = "dashboard.html"
        }
      
      console.log("user in state change", user)

      // ...
    } else {
        if(location.pathname !== "/signIn.html" && location.pathname !== "/signUp.html" ){
            location.href = "/signIn.html"
        }
        console.log("user not found in state change")
      // User is signed out
      
    }
  });

let signUpBtn = document.getElementById("register-btn");

spinner.style.display = "none"

let register = () => {
    
    let fullName = document.getElementById("fullName");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    spinner.style.display = "block"
    flag = false;
    createUserWithEmailAndPassword(auth, email.value, password.value)
  .then(async (userCredential) => {
    // Signed in 
    const user = userCredential.user;
    spinner.style.display = "none"
    console.log("user", user)
    // Add a new document in collection "users"
await setDoc(doc(db, "user", user.uid), {
    name : fullName.value,
    email : email.value,
    password : password.value
  });
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
      flag = true
      location.href = '/dashboard.html'
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    spinner.style.display = "none"
    console.log("error", error.message)
    Swal.fire({
        icon: 'error',
        title: error,
        text: errorMessage,
        footer: '<a href="">Why do I have this issue?</a>'
      })
  });
    

} 

signUpBtn && signUpBtn.addEventListener("click", register);

let signInBtn = document.getElementById("signIn-btn");

let signIn = () => {

    let email = document.getElementById("email");
    let password = document.getElementById("password");
    spinner.style.display = "block"
    
    signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    spinner.style.display = "none"
    console.log("user signed in",user)
    Swal.fire({
        position: 'top-end',
        icon: 'Signed in successfully',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    spinner.style.display = "none"
    console.log("error", error.message)
    Swal.fire({
        icon: 'error',
        title: errorMessage,
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
  });

}

signInBtn && signInBtn.addEventListener("click", signIn);


let signOutBtn = document.getElementById("sign-out");

let signOutUser = () => {
    

    signOut(auth).then(() => {
        console.log("sign out succesfully")
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log("error in sign out")
      });
}


signOutBtn && signOutBtn.addEventListener("click", signOutUser);


let updateProfileBtn = document.getElementById("update-profile");

let fileInput = document.getElementById("file-input")

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const mountainsRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(mountainsRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    })
}


const updateUserPassword = (oldPass, newPass) =>{

  new Promise((resolve, reject) => {
    let currentUser = auth.currentUser;
    console.log("currentUser" ,currentUser)

    // TODO(you): prompt the user to re-provide their sign-in credentials
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      oldPass
    )

    reauthenticateWithCredential(currentUser, credential).then((res) => {
      console.log("res reauthicated", res)
      // User re-authenticated.
      spinner.style.display = "block";
      updatePassword(currentUser, newPass).then(() => {
        resolve(res)
        // Update successful.
        spinner.style.display = "none";
    Swal.fire({
        position: 'top-end',
        icon: 'password updated succesfully',
        title: 'profile updated',
        showConfirmButton: false,
        timer: 1500
      })
      }).catch((error) => {
        reject(error)
        spinner.style.display = "none"
        
        Swal.fire({
            icon: error,
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href="">Why do I have this issue?</a>'
          })
        
      });
    
    
    }).catch((error) => {
      reject(error)
      console.log("error in reauthenticate", error)
      
      
    });
    


  })
}




let updatProfile = async () => {
  try{
   let fullName = document.getElementById("fullName");
   let userUid = document.getElementById("user-uid");

    console.log(fullName.value);
    console.log("user uid in update profile", userUid.value);
    spinner.style.display = "block";

    let oldPassword = document.getElementById("oldPassword");
    let newPassword = document.getElementById("newPassword");

    if(oldPassword, newPassword){
      await updateUserPassword(oldPassword.value, newPassword.value)
    }




    
    const user = {
       name : fullName.value   
    }

    if(fileInput.files[0]){

       user.profilePic = await uploadFile(fileInput.files[0])
    }
    
    const userRef = doc(db, "user", userUid.value);
    
    

await updateDoc(userRef, user );

spinner.style.display = "none";
Swal.fire({
    position: 'top-end',
    icon: 'successfully',
    title: 'profile updated',
    showConfirmButton: false,
    timer: 1500
  })

}catch (error){
  spinner.style.display = "none"
    console.log("error", error.message)
    Swal.fire({
        icon: error,
        title: 'Oops...',
        text: error.message,
        footer: '<a href="">Why do I have this issue?</a>'
      })
 
}

}

updateProfileBtn && updateProfileBtn.addEventListener("click", updatProfile);



fileInput && fileInput.addEventListener("change", (e) => {

  

    
    profilePic.src = URL.createObjectURL(e.target.files[0]);
    console.log(e.target.files[0])
  
})


const submitBlog = async () => {

  let title = document.getElementById("title");
  let textArea = document.getElementById("textArea");
  let currentUser = auth.currentUser;
  
  spinner.style.display = "block"
  const userRef = doc(db, "user", currentUser.uid);   

const userData = await getDoc(userRef);
console.log("userData", userData.data())

  // Add a new document with a generated id.
const docRef = await addDoc(collection(db, "blogs"), {
  title : title.value,
  description : textArea.value,
  time : serverTimestamp(),
  uid : currentUser.uid,
  user : userData.data()
  
});

getCurrentUserBlog(currentUser.uid);
console.log("Document written with ID: ", docRef.id);
title.value = "";
textArea.value = "";

spinner.style.display = "none";
Swal.fire({
    position: 'top-end',
    title: 'blog posted',
    showConfirmButton: false,
    timer: 1500
  })


}


let publishBlogBtn = document.getElementById("publish");

publishBlogBtn && publishBlogBtn.addEventListener("click", submitBlog);



const deleteBlog = async (id) => {

  let currentUser = auth.currentUser; 
  await deleteDoc(doc(db, "blogs", id));
  console.log("id to delete", id);
  Swal.fire({
    position: 'top-end',
    title: 'blog deleted',
    showConfirmButton: false,
    timer: 1500
  })

  getCurrentUserBlog(currentUser.uid);
}

let editModal = document.getElementById("edit-modal");

let editTitle = document.getElementById("edit-title");
let editTextArea = document.getElementById("edit-textArea");
let updateId = "";

let editBlog = (id, title, description) => {
  updateId = id;
  

  editModal.style.display = "block";

  editTitle.value = title;
  editTextArea.value = description;

}


let cancelBtn = document.getElementById("cancel-btn");

let cancelModal = () => {
 
  editModal.style.display = "none";

}

cancelBtn && cancelBtn.addEventListener("click", cancelModal);


let updatBlogBtn = document.getElementById("update-blog");

const updatBlog = async () => {
  
  let currentUser = auth.currentUser;
  console.log(editTitle.value, editTextArea.value, updateId)

  const ref = doc(db, "blogs", updateId);

 spinner.style.display = "block";

await updateDoc(ref, {
  title : editTitle.value,
  description : editTextArea.value
});

getCurrentUserBlog(currentUser.uid);
spinner.style.display = "none";
updateId = "";
editModal.style.display = "none";
Swal.fire({
  position: 'top-end',
  title: 'blog updated',
  showConfirmButton: false,
  timer: 1500
})


}

updatBlogBtn && updatBlogBtn.addEventListener("click", updatBlog);



window.editBlog = editBlog;
window.deleteBlog = deleteBlog;







