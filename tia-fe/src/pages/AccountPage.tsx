import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { getUserDesc, checkFriendship,addFriend, deleteFriend} from "../services/accountService";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast"
import { Link } from "react-router-dom";
import { getGroups, inviteToGroup } from "../services/groupService";


interface AccountPageProps{
    isLoggedIn:boolean;
}

const AccountPage: React.FC<AccountPageProps> = (({isLoggedIn}) =>{

    const {username} = useParams();

    const [friendsWith,setFriendsWith] = useState<number|undefined>(undefined); //not friends = 0, friends = 1, friends request pending = 2

    const [currUsername,setCurrUsername] = useState<string|undefined>(undefined);

    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    

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
                    console.log("result2", result2)
                    setFriendsWith(result2);

                  

                })
                
            }

            setCurrUsername(result.username);

        })
        .catch((e)=> {toast.error(e.message); return;});

        
        
    }, [editor,isLoggedIn,username]);



    const handleAddFriend = async ()=>{
        try{
            if(currUsername !== undefined) {
                const result =  await addFriend(currUsername);
                setFriendsWith(result ? 1 : 2);     
            }
        }catch (e:any){
            toast.error(e.message);
        }
    }

    const handleDeleteFriend = async ()=>{
        try{
            if(currUsername !== undefined) {
                await deleteFriend(currUsername);
                setFriendsWith(0);
            }
        }catch (e:any){
            toast.error(e.message);
        }
    }


    const [positionX, setPositionX] = useState<number>(0);
    const [positionY, setPositionY] = useState<number>(0);
    const [ownGroups, setOwnGroups] = useState<string[]>([]);
    
    const handleInviteGroup = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try{
            const result = await getGroups();
            setOwnGroups(result.map((x:any)=>x.group_name));
            setPositionX(e.clientX);
            setPositionY(e.clientY);
            setMenuVisible(true);
        }catch(e:any){
            toast.error(e.message);
            setMenuVisible(false);
        }
      }
      
    const handlePickGroup = async (group_name:string) =>{
        try{
            if(currUsername === undefined){return};
            await inviteToGroup(group_name, currUsername);
        }catch(e:any){
            toast.error(e.message);
        }
        setMenuVisible(false);
    }

    /* ---------------------------------------------------------------- */
    
    //rerenders too much?
    console.log(friendsWith);

    if(!currUsername){
        return(
            <></>
        )
    }else{
        return(
            <div className="page1">

            
                <div>
                    <h1>{currUsername}</h1>
                    <Link to={`/files/${currUsername}`}> Files </Link>
                    {((isLoggedIn && friendsWith !== 3) && friendsWith !== undefined) && (friendsWith == 0 ? (   //add if your own account then you cant add yourself as friends / maybe switch to myaccountpage? 
                        <>
                            <button onClick={handleAddFriend}>ADD FRIEND</button>
                        </>

                    ) : friendsWith == 1 ? ( 
                        <>
                            <button onClick={handleDeleteFriend}>REMOVE FRIEND</button>
                        </>
                    
                    ) : (
                        <>
                            <button onClick={handleDeleteFriend}>CANCEL REQUEST</button>
                        </>

                    ) )}

                    {(isLoggedIn && friendsWith !==3) && friendsWith !== undefined && (
                        <>

                        {menuVisible && (
                        <div className="contextMenu" style ={{ position: 'absolute',
                            top: `${positionY}px`,
                            left: `${positionX}px`,
                            zIndex: 1000,
                            }}> 

                            <ul>
                            <li onClick={()=>setMenuVisible(false)}>Close menu</li>

                                {ownGroups.map((grp,index)=>
                                    (<li onClick={()=>(handlePickGroup(grp))} 
                                    key={index}>
                                    
                                        {grp}
                                    
                                    </li>)
                                )}
                            </ul>
                        </div>
                        )}
                                            
                        <button onClick={handleInviteGroup}>INVITE TO GROUP</button>

                        </>
                    )}
                    
                    <EditorContent editor={editor} className="tiptap-editor-bio" />

                </div>
                
                
            </div>
        )
    }
})

export default AccountPage;