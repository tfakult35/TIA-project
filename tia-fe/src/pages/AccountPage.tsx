import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { getUserDesc, getFriends } from "../services/accountService";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast"


interface AccountPageProps{
    isLoggedIn:boolean;
}

const AccountPage: React.FC<AccountPageProps> = (({isLoggedIn}) =>{

    const {username} = useParams();

    const [currUsername,setCurrUsername] = useState<string|null>(null);
    const [friends, setFriends] = useState([]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editable: false,
      });
    
    useEffect( () => {
        
        if (!editor) return;

        if(!username && !isLoggedIn){
            return;
        }
        getUserDesc(username) //undefined/string
        .then((result)=>{
            
            editor.commands.setContent(result.user_desc);
            setCurrUsername(result.username);
        })
        .catch((e)=> {toast.error(e.message); return;});


        if (isLoggedIn) {
            getFriends()
                .then((result) => {
                    setFriends(result); 
                })
                .catch((e) => console.log("Error"));
        }
        
    }, [editor,isLoggedIn]);
    
    if(!isLoggedIn && !username){
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
                <div>
                    <h1>{currUsername}</h1>
                    <EditorContent editor={editor} className="tiptap-editor" />

                </div>
                {isLoggedIn && (
                 <div>
                 <h2>Your Friends</h2>
                 <ul>
                     
                 </ul>
             </div>
                )}
                
            </div>
        )
    }
})

export default AccountPage;