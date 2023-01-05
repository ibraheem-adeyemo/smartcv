import { Onboarding } from "../../src/component/layouts";
import { Text } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cookieKeys, links, sessionStorageKeys } from "../../src/constants";
import { getCookie } from "../../src/lib";
import { OnboardingProvider, OnboardingContext, CrossDomainOnboardingProvider } from "../../src/providers";
import { AnimatePresence } from "framer-motion";

const CreateBank = dynamic(() => import('../../src/component/onboarding/create-bank'), {ssr:false})
const CreateSuperAmin = dynamic(() => import('../../src/component/onboarding/create-super-admin'), {ssr:false})
const InstitutionColors = dynamic(() => import('../../src/component/onboarding/institution-colors'), {ssr:false})


interface LoadTabProps {
    step: string | string[],
    state: number
}

const LoadTab: FC<LoadTabProps> = (props: LoadTabProps) => {
  
    switch (`/onboarding/${props.step}`) {
        case links.createBank:
            return <CreateBank step={props.state} />
        case links.createSuperAdmin:
            return <CreateSuperAmin step={props.state} />
        case links.institutionColors:
            return <InstitutionColors step={props.state} />
        default:
            return <Text>No Tab was selected</Text>
    }
}
export default function Step1(props: any) {
    const router = useRouter()
    const { step } = router.query
    const { steps } = useContext(OnboardingContext)
    const [stepNumber, setStepNumber] = useState<number>()
    const isTepAndStateLoaded = typeof stepNumber !== "undefined" && typeof step !== "undefined"
    useEffect(() => {
        // debbuger
        if (typeof steps !== "undefined" && typeof step !== "undefined") {
            const index = steps.findIndex((x, i) => x.url === `/onboarding/${step}`)
            if (index < 0) {
                if (typeof window !== "undefined") {
                    router.push(links.notFound)
                }
            } else {
                setStepNumber(index)
            }
        }
    }, [steps, step])

    useEffect(() => {      
        if (typeof window !== "undefined") {
          
            const interchange1 = getCookie(cookieKeys.interchangeId)
            const interchange2 = window.sessionStorage.getItem(sessionStorageKeys.interchangeId)
            if (!interchange1 && !interchange2)
                router.push(links.registerOrganization)
        }
    }, [])
    return (
        <>
            {typeof window !== "undefined" &&
                <CrossDomainOnboardingProvider>
                    <OnboardingProvider>
                        <Onboarding>
                            <AnimatePresence>{ isTepAndStateLoaded && <LoadTab state={stepNumber} step={step} />}</AnimatePresence>
                            <AnimatePresence>{ !isTepAndStateLoaded && <></>}</AnimatePresence>
                        </Onboarding>
                    </OnboardingProvider>
                </CrossDomainOnboardingProvider>
            }
        </>
    )
}

