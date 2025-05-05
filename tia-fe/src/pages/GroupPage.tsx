import { useParams } from 'react-router-dom';
import toast from "react-hot-toast"
import { useEffect, useState } from 'react';
import { getGroupMembers } from '../services/groupService';


interface GroupPageProps{
    isLoggedIn:Boolean
}

const GroupPage: React.FC<GroupPageProps> = ({isLoggedIn}) => { 

    var {group_name} = useParams();
    const [groupMembers,setGroupMembers] = useState<string[]>([]);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(()=>{

        if(group_name === undefined){
            return;
        }

        getGroupMembers(group_name)
        .then((result)=>{
            setGroupMembers(result.map((x:any)=>(x.username)));
            setReady(true);
        }).catch ((e)=>{
            toast.error(e.message)
            group_name = undefined;
            setReady(true);
        })
    }, []        
    )
    


    if(!ready){
        return <>Loading</>
    }

    if(group_name){
        return <></>
    }
    
    return(

        <div>

            
            <h2>Group members</h2>
            <div>
            <ul>
                {groupMembers.map((member,index)=>(<li key={index}> {member} </li>))}
            </ul>
            </div>            

        </div>

    )
}

export default GroupPage