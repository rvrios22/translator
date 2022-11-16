import "./translate.css"
import { Form, TextArea, Button, Icon } from 'semantic-ui-react'
import axios from "axios"
import { useState, useEffect } from "react"

const Translate = () => {
    const [inputText, setInputText] = useState('')
    const [detectLanguageKey, setDetectLanguageKey] = useState('')
    const [languageList, setLanguageList] = useState([])
    const [selectedLanguageKey, setSelectedLanguageKey] = useState('')
    const [resultText, setResultText] = useState('')

    useEffect(() => {
        axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                setLanguageList(response.data)
            })
        
        getLanguageSource()
    }, [inputText])

    
    const handleOnChange = (text) => {
        setInputText(text.target.value)
    }

    const getLanguageSource = () => {
        axios.post(`https://libretranslate.de/detect`, {
            q: inputText
        })
        .then((response) => {
            setDetectLanguageKey(response.data[0].language)
        })
    }

    const languageKey = (selectedLanguage) => {
        setSelectedLanguageKey(selectedLanguage.target.value)
    }

    const translateText = () => {
        getLanguageSource()

        let data = {
            q: inputText,
            source: detectLanguageKey,
            target: selectedLanguageKey
        }

        axios.post(`https://libretranslate.de/translate`, data)
        .then((response) => {
            setResultText(response.data.translatedText)
        })
    }


    return (
        <div>
            <div className="app-header">
                <h1 className="header">Translator</h1>
            </div>
            <main className="app-body">
                <Form>
                    <Form.Field 
                        className="form-child"
                        control={TextArea}
                        placeholder='Type here to translate...'
                        onChange={handleOnChange}
                    />
                    <select className="language-selector form-child" onChange={languageKey}>
                        <option>Please Select a Language...</option>
                        {languageList.map(lang => {
                            return (
                                <option value={lang.code}>
                                    {lang.name}
                                </option>
                            )
                        })}
                    </select>
                    <Form.Field 
                        className="form-child"
                        control={TextArea}
                        placeholder='Translation...'
                        value={resultText}
                    />
                    <Button 
                    basic
                    color="orange"
                    onClick={translateText}
                    >   <Icon name="translate" />
                        Translate
                    </Button>
                </Form>
            </main>
        </div>
    )
}

export default Translate;