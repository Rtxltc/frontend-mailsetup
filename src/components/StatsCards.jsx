import { motion } from "framer-motion";
import {
    Send,
    Clock3,
    ShieldCheck,
    Cpu
} from "lucide-react";

const cards = [
    {
        title: "Emails Sent",
        value: "152",
        icon: Send,
        color: "#7c3aed"
    },
    {
        title: "Today",
        value: "12",
        icon: Clock3,
        color: "#06b6d4"
    },
    {
        title: "Verified Devices",
        value: "5",
        icon: ShieldCheck,
        color: "#22c55e"
    },
    {
        title: "API Status",
        value: "Online",
        icon: Cpu,
        color: "#f97316"
    }
];

export default function StatsCards() {

    return (

        <div className="stats-grid">

            {cards.map((card, index) => {

                const Icon = card.icon;

                return (

                    <motion.div

                        key={card.title}

                        initial={{
                            opacity: 0,
                            y: 25
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}

                        transition={{
                            delay: index * .1
                        }}

                        whileHover={{

                            y:-10,

                            scale:1.03,

                            rotateX:4,

                            rotateY:-4

                        }}

                        className="stat-card"

                    >

                        <div
                            className="stat-icon"
                            style={{
                                background: card.color
                            }}
                        >

                            <Icon size={22} />

                        </div>

                        <div>

                            <small>{card.title}</small>

                            <h2>{card.value}</h2>

                        </div>

                    </motion.div>

                );

            })}

        </div>

    );

}