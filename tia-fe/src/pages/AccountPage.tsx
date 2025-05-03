import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { getUserDesc, checkFriendship } from "../services/accountService";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast"
import { Link } from "react-router-dom";


interface AccountPageProps{
    isLoggedIn:boolean;
}

const AccountPage: React.FC<AccountPageProps> = (({isLoggedIn}) =>{

    const {username} = useParams();

    const [friendsWith,setFriendsWith] = useState<number|undefined>(undefined); //not friends = 0, friends = 1, friends request pending = 2

    const [currUsername,setCurrUsername] = useState<string|undefined>(undefined);
    

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editable: false,
      });
    
    useEffect( () => {
        
        if (!editor) return;

        if(username === undefined){
            return;
        }

        getUserDesc(username) //undefined/string
        .then((result)=>{
            
            editor.commands.setContent(result.user_desc);


            if (isLoggedIn && result.username !== undefined){
                checkFriendship(result.username)
                .then((result2)=>{
                    setFriendsWith(result2);
                })
                
            }

            setCurrUsername(result.username);

        })
        .catch((e)=> {toast.error(e.message); return;});

        
        
    }, [editor,isLoggedIn,username]);



    const handleAddFriend = async ()=>{
        
    }

    /* ---------------------------------------------------------------- */
    

    if(!currUsername){
        return(
            <></>
        )
    }else{
        return(
            <div className="account-page">

            
                <div>
                    <h1>{currUsername}</h1>
                    <Link to={`/files/${currUsername}`}> Files </Link>
                    {(isLoggedIn && friendsWith !== undefined) && (friendsWith == 0 ? (   //add if your own account then you cant add yourself as friends / maybe switch to myaccountpage? 
                        <>
                            <button onClick={handleAddFriend}>ADD FRIEND</button>
                        </>

                    ) : friendsWith == 1 ? ( 
                        <>
                            <button>REMOVE FRIEND</button>
                        </>
                    
                    ) : (
                        <>
                            <button>CANCEL REQUEST</button>
                        </>

                    ) )}
                    <EditorContent editor={editor} className="tiptap-editor" />

                </div>
                
                
            </div>
        )
    }
})

export default AccountPage;