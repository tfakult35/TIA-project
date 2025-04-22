import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { getUserDesc, getFriends } from "../services/accountService";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast"
import { Link } from "react-router-dom";


interface AccountPageProps{
    isLoggedIn:boolean;
}

const AccountPage: React.FC<AccountPageProps> = (({isLoggedIn}) =>{

    const {username} = useParams();

    const [currUsername,setCurrUsername] = useState<string|undefined>(undefined);
    const [friends, setFriends] = useState<any[]>([]);

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
        
    }, [editor,isLoggedIn,username]);
    
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

                {isLoggedIn && (username === undefined) && (
                 <div className="friendslist">
                    <h2>Your Friends</h2>
                        <ul>
                        {friends.map((friendObj, index) => (
                            <li key={index}> 
                                <Link to={`/account/${friendObj.friend}`}> {friendObj.friend } </Link>
                            </li> 
                         ))}
                        </ul>
                </div>
                )}
                <div>
                    <h1>{currUsername}</h1>
                    <Link to={`/files/${currUsername}`}> Files </Link>
                    <EditorContent editor={editor} className="tiptap-editor" />

                </div>
                
                
            </div>
        )
    }
})

export default AccountPage;