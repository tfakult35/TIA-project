import { useEffect, useState } from "react";
import { getGroups, getGroupsReqs, createNewGroup, leaveGroup } from "../services/groupService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface GroupPageProps{
    isLoggedIn:Boolean
}

const MyGroupPage: React.FC<GroupPageProps> = ({isLoggedIn}) => { 

    const [groups,setGroups] = useState<string[]>([]);
    const [groupReqs,setGroupReqs] = useState<string[]>([]);
    const [nameInput,setNameInput] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");

   
    useEffect( () => {
        
        if (!isLoggedIn) return;
       
        getGroups()  
            .then((result) => {
                const groupArray = result.map((groupObj:any)=> (groupObj.group_name));
                setGroups(groupArray); 
            })
            .catch(() => toast.error("Error getting groups")); //TODO: toaster

        getGroupsReqs()
            .then((result)=>{
                const groupReqsArray = result.map((groupReqObj:any)=> (groupReqObj.group_name));
                setGroupReqs(groupReqsArray);
            })
            .catch(() => toast.error("Error getting group requests"));
    
        
    }, [isLoggedIn]);
   
    if(!isLoggedIn){
        return(
            <>Log in to manage your groups!</>
        )
    } 


    const handleCreateNewGroup = async()=>{
        setNameInput(true);
    }

    const submitName = async()=>{
        const cleanedName = newName.replace(/[^a-zA-Z0-9]/g, '');
         if(cleanedName.trim() === '') return;

        try{ 
            await createNewGroup(cleanedName);
            setGroups([...groups,cleanedName])

        }catch (e:any){
            toast.error(e.message); return;
        }
        
        setNameInput(false);
    }



    const handleLeaveGroup = async(group_name:string) =>{
        try{
            await leaveGroup(group_name);
            setGroups((curr)=>curr.filter((g)=>(g !== group_name)));
        }catch(e:any){
            toast.error(e.message);
        }
    }

    return(

        <div className="page1">

            <h2>My groups</h2>
            <div className="listing1">
            <ul>
                {(groups.length === 0) && (
                    <li>You not in a group.</li>)}
                {groups.map((grp, index) => (
                    <li key={index}> 
                        <Link to={`/groups/${grp}`}> { grp } </Link> <button onClick={()=>handleLeaveGroup(grp)}>LEAVE GROUP</button>
                    </li> 
                ))}
            </ul>
            </div>
            <button onClick ={handleCreateNewGroup}>Create new group</button>
            {nameInput && (
                <div>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            submitName();
                        } else if (e.key === 'Escape') {
                            setNameInput(false);
                        }
                        }}
                        autoFocus
                    />
                </div>) }

            <h2>Group requests</h2>
            <div>
                <ul>
                {(groupReqs.length === 0) && (
                    <li>You not in a group.</li>)}
                {groupReqs.map((grp, index) => (
                    <li key={index}> 
                        <Link to={`/groups/${grp}`}> { grp } </Link>
                        <button>ACCEPT</button>
                        <button>DENY</button>
                    </li> 
                ))}
                </ul>
            </div>

        </div>

    )
}

export default MyGroupPage