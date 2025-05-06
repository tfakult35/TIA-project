import { Link, useParams } from 'react-router-dom';
import toast from "react-hot-toast"
import { useEffect, useState } from 'react';
import { getGroupMembers } from '../services/groupService';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";




interface GroupPageProps{
    isLoggedIn:Boolean
}

const GroupPage: React.FC<GroupPageProps> = ({isLoggedIn}) => { 

    var {group_name} = useParams();
    const [groupMembers,setGroupMembers] = useState<string[]>([]);
    const [ready, setReady] = useState<boolean>(false);

    const editor = useEditor({
            extensions: [StarterKit],
            content: "",
            editable: false,
    });


    useEffect(()=>{

        if (!editor) return;

        if(group_name === undefined){
            return;
        }


        getGroupMembers(group_name)
        .then((result)=>{
            setGroupMembers(result.map((x:any)=>(x.username)));
            setReady(true);
        }).catch ((e)=>{
            if(e.message ==="Permission"){
                setGroupMembers([]);
                setReady(true);
                return;
            }

            toast.error(e.message)
            group_name = undefined;
            setReady(true);
        })
    }, [isLoggedIn]        
    )
    


    if(!ready){
        return <>Loading</>
    }

    if(group_name === undefined){
        return <>No such group</>
    }
    
    return(

        <div>

            <h2>{group_name}</h2>


            {(groupMembers.length !== 0) && (
                <>
                <Link to={`/groups/${group_name}/files`}> FILES </Link>
                <h2>Group members</h2>
                <div>
                    <ul>
                        {groupMembers.map((member,index)=>(<li key={index}> <Link to={`/account/${member}`}> {member } </Link> </li>))}
                    </ul>
                </div>
                </>
            )}

        </div>

    )
}

export default GroupPage