import { useContext } from "react"
import { TranslationContext } from "./TranslationContext"

export const T = ({ children }) => {
    const { trads } = useContext(TranslationContext)

    return trads[children] || children
}