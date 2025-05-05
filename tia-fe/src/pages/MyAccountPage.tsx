import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { getUserDesc, getFriends, getFriendReqs, deleteFriend, addFriend, setBio } from "../services/accountService";
import toast from "react-hot-toast"
import { Link } from "react-router-dom";


interface MyAccountPageProps{
    isLoggedIn:boolean;
}

const MyAccountPage: React.FC<MyAccountPageProps> = (({isLoggedIn}) =>{

    const [currUsername,setCurrUsername] = useState<string|undefined>(undefined);
    const [friends, setFriends] = useState<string[]>([]);
    const [friendReqs,setFriendReqs] = useState<string[]>([]); 

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editable: true,
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
                const friendReqsArray = result.map((friendReqObj:any)=> (friendReqObj.friend));
                setFriendReqs(friendReqsArray);
            })
            .catch(() => console.log("Error"));
    
        
    }, [editor,isLoggedIn]);


    const handleAddFriend = async (username:string)=>{
        try{
            await addFriend(username);
            setFriendReqs(arr => arr.filter(u1 => u1 !== username));
            setFriends(arr => [...arr,username]);
        }catch(e:any){
            toast.error(e.message);
        }
    }

    const handleDeleteFriend = async (username:string)=>{
        try{
            await deleteFriend(username);
            setFriendReqs(arr => arr.filter(u1 => u1 !== username));
        }catch(e:any){
            toast.error(e.message);
        }
    }

    const handleSaveBio = async () =>{
        if(editor ){
            try{
                await setBio(editor.getHTML());
            }catch (e:any){
                toast.error(e.message);
            }
      
          }          
    }

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
                        <div className='col-sm-6'>
                        <h2>Your Friends</h2>
                        <div className="friendslist">
                                
                                <ul>
                                {(friends.length === 0) && (
                                    <li>You have no friends.</li>)}
                                {friends.map((friend, index) => (
                                    <li key={index}> 
                                        <Link to={`/account/${friend}`}> {friend } </Link>
                                    </li> 
                                ))}
                                </ul>
                        </div>
                        </div>


                        <div className='col-sm-6'>

                        <h2>Friend requests</h2>
                        <div className="friendslist">
                                
                                <ul>
                                {(friendReqs.length === 0) &&  
                                    (<li>You have no friend requests.</li>)}
                                {friendReqs.map((friendReq, index) => (
                                    <li key={index}> 
                                        <Link to={`/account/${friendReq}`}> {friendReq } </Link> 
                                        <button onClick = {()=>(handleAddFriend(friendReq))}>Accept</button> 
                                        <button onClick = {()=>(handleDeleteFriend(friendReq))}>Decline</button>
                                    </li> 
                                ))}
                                </ul>
                        </div>
                        </div>

                    </div>

                    <div >
                        <h1>{currUsername}</h1>
                        <button onClick={handleSaveBio}>SAVE BIO</button>
                        <EditorContent editor={editor} className="tiptap-editor-bio" />

                    </div>


                </div>

                
                
            </div>
        )
    }
})

export default MyAccountPage;