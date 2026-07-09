import {
    Inbox,
    PenSquare,
    Star,
    Trash2,
    Send,
    RefreshCw
} from "lucide-react";

export default function Sidebar({
    activeTab,
    setActiveTab,
    loadInbox
}) {

    return (

        <aside className="sidebar">

            <button
                className={activeTab==="compose"?"active":""}
                onClick={()=>setActiveTab("compose")}
            >
                <PenSquare size={20}/>
                Compose
            </button>

            <button
                className={activeTab==="inbox"?"active":""}
                onClick={()=>setActiveTab("inbox")}
            >
                <Inbox size={20}/>
                Inbox
            </button>

            <button
                className={activeTab==="sent"?"active":""}
                onClick={()=>setActiveTab("sent")}
            >
                <Send size={20}/>
                Sent
            </button>

            <button
                className={activeTab==="starred"?"active":""}
                onClick={()=>setActiveTab("starred")}
            >
                <Star size={20}/>
                Starred
            </button>

            <button
                className={activeTab==="trash"?"active":""}
                onClick={()=>setActiveTab("trash")}
            >
                <Trash2 size={20}/>
                Trash
            </button>

            <hr/>

            <button
                onClick={loadInbox}
            >
                <RefreshCw size={18}/>
                Refresh
            </button>

        </aside>

    );

}