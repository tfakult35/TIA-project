import { useState } from "react";
import { searchAccounts } from "../services/accountService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const SearchPage: React.FC = () => { 

    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState<Array<String>|undefined>(undefined);

    const handleSearch = async () =>{
        try{        //TODO: set search result as result of searchaccount
            if(searchInput.replace(' ','')===''){
                toast.error("The search bar is empty.");
                return;
            }
            const result = await searchAccounts(searchInput);
            const stringResult = result.map((x:any)=>(x.username));
            setSearchResult([...stringResult]);
            
        }catch (e:any){
            toast.error(e.message);
        }
    }

    return(

        <div>
            <div>
                <h2>Search for an account</h2>
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}></input>          
                <button onClick ={handleSearch}>SEARCH</button>
            </div>
            <div>
                
                {searchResult !== undefined && (
                    <ul>
                        {   searchResult.length > 0 ? (
                            searchResult.map((user,index)=>(
                                <li key={index}>
                                    <Link to={`/account/${user}`}> {user} </Link>
                                </li>
                            ))
                        )  : (
                            <>No user found</>
                        )
                        }      
                    </ul>
                )}
            </div>
        </div>

    )
}

export default SearchPage