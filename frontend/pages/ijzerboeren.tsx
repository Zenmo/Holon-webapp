import { Step1 } from "@/components/IJzerboeren/Step1/Step1"
import { basePageWrap } from "@/containers/BasePage"
import {Step2} from "@/components/IJzerboeren/Step2/Step2"
import {Step3} from "@/components/IJzerboeren/Step3/Step3"

export default basePageWrap(() => {
    return (
        <>
            <Step1 />
            <Step2 />
            <Step3 />
        </>
    )
})
