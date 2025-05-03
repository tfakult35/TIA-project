import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { getUserDesc, getFriends, getFriendReqs } from "../services/accountService";
import toast from "react-hot-toast"
import { Link } from "react-router-dom";


interface MyAccountPageProps{
    isLoggedIn:boolean;
}

const MyAccountPage: React.FC<MyAccountPageProps> = (({isLoggedIn}) =>{

    const [currUsername,setCurrUsername] = useState<string|undefined>(undefined);
    const [friends, setFriends] = useState<string[]>([]);
    const [friendReqs,setFriendReqs] = useState<any[]>([]); 

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editable: false,
      });
    
    useEffect( () => {
        
        if (!editor) return;
        if (!isLoggedIn) return;

        getUserDesc(undefined) //undefined/string
        .then((result)=>{
            
            editor.commands.setContent(result.user_desc);
            setCurrUsername(result.username); //!!!
        })
        .catch((e)=> {toast.error(e.message); return;});


        
        getFriends()
            .then((result) => {
                const friendsArray = result.map((friendObj:any)=> (friendObj.friend));
                setFriends(friendsArray); 
            })
            .catch(() => console.log("Error")); //TODO: toaster

        getFriendReqs()
            .then((result)=>{
                setFriendReqs(result);
            })
            .catch(() => console.log("Error"));
    
        
    }, [editor,isLoggedIn]);


    /* ---------------------------------------------------------------- */
    
    if(!isLoggedIn){
        return(
            <>Log in to see your account!</>
        )
    }

    if(!currUsername){
        return(
            <></>
        )
    }else{
        return(
            <div className="account-page">

                <div className='container'>

                    <div className='row'>
                        <div className='col-6'>
                        <h2>Your Friends</h2>
                        <div className="friendslist">
                                <ul>
                                {friends.map((friend, index) => (
                                    <li key={index}> 
                                        <Link to={`/account/${friend}`}> {friend } </Link>
                                    </li> 
                                ))}
                                </ul>
                        </div>
                        </div>


                        <div className='col-6'>

                        <h2>Friends requests</h2>
                        <div className="friendslist">
                                <ul>
                                {friendReqs.map((friendReqObj, index) => (
                                    <li key={index}> 
                                        <Link to={`/account/${friendReqObj.friend}`}> {friendReqObj.friend } </Link> <button>Accept</button> <button>Decline</button>
                                    </li> 
                                ))}
                                </ul>
                        </div>
                        </div>

                    </div>

                    <div className='row'>
                        <h1>{currUsername}</h1>

                    
                    
                        <EditorContent editor={editor} className="tiptap-editor" />
                        <button>EDIT BIO</button>

                    </div>


                </div>

                
                
            </div>
        )
    }
})

export default MyAccountPage;