import { useState } from "react";
import { searchAccounts } from "../services/accountService";
import { searchGroups } from "../services/groupService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const SearchPage: React.FC = () => { 

    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState<Array<String>|undefined>(undefined);
    const [searchWhat, setSearchWhat] = useState<number>(0);

    const handleSearch = async () =>{
        try{        
            if(searchInput.replace(' ','')===''){
                toast.error("The search bar is empty.");
                return;
            }

            var stringResult;
            if(searchWhat===0){
                const result = await searchAccounts(searchInput);
                stringResult = result.map((x:any)=>(x.username));
                
            }else{
                const result = await searchGroups(searchInput);    //TODO FIX LINKS
                stringResult = result.map((x:any)=>(x.group_name));
            }
            setSearchResult([...stringResult]);
        }catch (e:any){
            toast.error(e.message);
        }
    }

    const handleSearchWhat = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setSearchResult(undefined);
        const value = parseInt(e.target.value);
        setSearchWhat(value);
    }

    return(

        <div className="page2">
            <div>
                <h2>Search</h2>
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}></input>          
                <button onClick ={handleSearch}>SEARCH</button>
                <label><input type="radio" name="access" value={0} onChange={handleSearchWhat} checked={searchWhat===0} /> Accounts</label>
                <label><input type="radio" name="access" value={1} onChange={handleSearchWhat} checked={searchWhat===1} /> Groups</label><br />

            </div>
            <div>
                
                <div className="listing1">
                {searchResult !== undefined && (
                    <ul>
                        {   searchResult.length > 0 ? (
                            searchResult.map((x,index)=>(
                                <li key={index}>
                                    {!searchWhat ? 
                                    (<Link to={`/account/${x}`}> {x} </Link>)
                                    : 
                                    (<Link to={`/groups/${x}`}> {x} </Link>)}
                                </li>
                            ))
                        ) : (
                            <>Zero results</>
                        )
                        }      
                    </ul>
                )}
                </div>
            </div>
        </div>

    )
}

export default SearchPage