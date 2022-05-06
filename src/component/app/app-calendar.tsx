import { Text, MenuButton, Select, Flex, Menu, MenuList, MenuItem, Button, Tag, VStack } from "@chakra-ui/react"
import { range } from "lodash"
import { FC, useEffect, useRef, useState } from "react"
import { days, DropdownIcon, hours, keysForArrayComponents, minutes, months, seconds, selectionModeValues } from "../../constants"
import { appDate } from "../../lib"
import { AnimatedText, MotionMenu, MotionMenuItem, MotionMenuList } from "../framer"

import { getCurrentTime } from '../../lib'

type getSelectedDateFunc = ({ date, time }: { date: string, time: string }) => void
interface AppCalendarProps {
    selectedDate?: string,
    selectedTime?: string,
    selectionMode?: selectionModeValues
    getSelectedDate?: getSelectedDateFunc,
    label?:string
}

/**
 * 
 * @param {string} date - yyyy-mm-dd
 */
function getCalenderDate(date?: string) {
    // debugger
    const sDate = date ? new Date(date) : new Date()
    const cArray: number[][] = []
    const ld = new Date(sDate.getFullYear(), sDate.getMonth() + 1, 0)
    let week = 0
    for (let i = 1; i <= ld.getDate(); i++) {
        // debugger
        const f = new Date(sDate.getFullYear(), sDate.getMonth(), i)
        const day = f.getDay();
        if (i > 0) {
            if (day == 0) {
                week = week + 1
            }
        }
        if (!cArray[week]) {
            cArray[week] = []
        }
        if (!cArray[week][day]) {
            for (let j = 0; j <= day; j++) {
                if (!cArray[week][j]) {
                    cArray[week][j] = 0
                }
            }
        }
        cArray[week][day] = f.getDate()
        if (!cArray[week][day + 1]) {
            for (let j = day + 1; j <= 6; j++) {
                cArray[week][j] = 0
            }
        }

    }
    return { calender: cArray, year: sDate.getFullYear(), monthNumber: sDate.getMonth() }
}

const AppCalendar: FC<AppCalendarProps> = ({ selectionMode = selectionModeValues.pickDate, ...props }: AppCalendarProps) => {
    // debugger
    const today = new Date()
    const now = getCurrentTime();

    const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    const fromPropsDateArray = props.selectedDate? props.selectedDate.split("-"):[]
    if(fromPropsDateArray.length > 0) {
        fromPropsDateArray[1] = fromPropsDateArray[1].length === 2 && +fromPropsDateArray[1][0] === 0? fromPropsDateArray[1][1]:fromPropsDateArray[1]
        fromPropsDateArray[2] = fromPropsDateArray[2].length === 2 && +fromPropsDateArray[2][0] === 0? fromPropsDateArray[2][1]:fromPropsDateArray[2]

    } 

    const fromPropsDateString = fromPropsDateArray.join("-")
    const [selectedDate, setSelectedDate] = useState(!props.selectedDate ? todayString : fromPropsDateString)
    const [selectedTime, setSelectedTime] = useState(!props.selectedTime ? now : props.selectedTime)
    const [calenderInfo, setCalenderInfo] = useState(getCalenderDate(selectedDate))
    const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate);
    const startyear = 2002
    const currentYear = (new Date).getFullYear()
    const yearRange = currentYear - startyear + 1


    useEffect(() => {
        setCalenderInfo(getCalenderDate(tempSelectedDate))
        if (tempSelectedDate.split("-").length === 3) {
            setSelectedDate(() => {
                const rDateArray = tempSelectedDate.split("-")
                rDateArray[1] = rDateArray[1].length === 1 ? `0${rDateArray[1]}` : rDateArray[1]
                rDateArray[2] = rDateArray[2].length === 1 ? `0${rDateArray[2]}` : rDateArray[2]
                return rDateArray.join("-")
            })
        }
    }, [tempSelectedDate])

    useEffect(() => {
        if (props.getSelectedDate) {
            props.getSelectedDate({ date: selectedDate, time: selectedTime })
        }
    }, [selectedDate, selectedTime])

    return (
        <MotionMenu closeOnSelect={false} onOpen={() => {
            setTempSelectedDate(selectedDate)
        }} >
            <MenuButton as={Button} h={props.label?"32px":"26px"} p="12px" rightIcon={<DropdownIcon />} borderWidth={'1px'} borderStyle={'bold'} borderColor={'var(--chakra-colors-brand-primary-blue)'}>
                <Flex flexDir={"column"} alignItems="start">
                    {props.label && <AnimatedText size="dropdown-text" variant="dropdown-text-header" color={'brand.primary-blue'}>{props.label}: </AnimatedText>}
                    <AnimatedText size="dropdown-text" variant="dropdown-text-header" color={'brand.primary-blue'}>{selectionMode === selectionModeValues.pickDateTime ? appDate(props.selectedDate + " " + props.selectedTime) : appDate(selectedDate, false)}</AnimatedText>
                </Flex>
            </MenuButton>
            <MotionMenuList >
                <MotionMenuItem as={Flex} closeOnSelect={false} justifyContent={"flex-start"} gap="10px" >
                    <VStack>
                        <Text textAlign={"left"}>Year</Text><Select placeholder='Select option' onClick={e => e.stopPropagation()} onChange={(e) => {
                            e.stopPropagation()
                            const selectedYearSelect = (e.target as HTMLSelectElement)
                            const selectedYear = selectedYearSelect.options[selectedYearSelect.selectedIndex].value
                            const month = calenderInfo.monthNumber
                            setTempSelectedDate(`${selectedYear}-${month + 1}`)
                        }} value={calenderInfo.year}>
                            {range(yearRange).map((x, i) => <option value={startyear + x} key={`${keysForArrayComponents.calenderMonthOption}-${i}`}> {startyear + x}</option>)}
                        </Select>
                    </VStack>
                    <VStack>
                        <Text textAlign={"left"}>Month</Text>
                        <Select placeholder='Select option' onClick={e => e.stopPropagation()} onChange={(e) => {
                            // debugger
                            e.stopPropagation()
                            const monthSelect = (e.target as HTMLSelectElement)
                            const month = +monthSelect.options[monthSelect.selectedIndex].value + 1
                            const selectedYear = calenderInfo.year
                            setTempSelectedDate(`${selectedYear}-${month}`)
                        }} value={calenderInfo.monthNumber} >
                            {months.map((x, i) => <option value={i} key={`${keysForArrayComponents.calnderYearOption}-${i}`}> {x}</option>)}
                        </Select>
                    </VStack>
                </MotionMenuItem>
                {selectionMode === selectionModeValues.pickDateTime &&
                    <MotionMenuItem as={Flex} closeOnSelect={false} justifyContent={"flex-start"} gap="10px" >

                        <VStack>
                            <Text textAlign={"left"}>HH</Text>
                            <Select onClick={e => e.stopPropagation()} value={selectedTime.split(":")[0]} onChange={(e) => {
                                e.stopPropagation()
                                const curr = e.target as HTMLSelectElement
                                const hour = curr.options[curr.selectedIndex].value
                                setSelectedTime((prev) => {
                                    const newTime = prev;
                                    const timeArray = newTime.split(":");
                                    timeArray[0] = hour
                                    return timeArray.join(":")
                                })
                            }}>
                                {hours.map((x, i) => <option value={x} key={`${keysForArrayComponents.calenderHourOption}-${i}`}>{x}</option>)}
                            </Select>
                        </VStack>
                        <VStack>
                            <Text textAlign={"left"}>MM</Text>
                            <Select onClick={e => e.stopPropagation()} value={selectedTime.split(":")[1]} onChange={(e) => {
                                e.stopPropagation()
                                const curr = e.target as HTMLSelectElement
                                const minute = curr.options[curr.selectedIndex].value
                                setSelectedTime((prev) => {
                                    const newTime = prev;
                                    const timeArray = newTime.split(":");
                                    timeArray[1] = minute
                                    return timeArray.join(":")
                                })
                            }}>
                                {minutes.map((x, i) => <option value={x} key={`${keysForArrayComponents.calenderMinuteOption}-${i}`}>{x}</option>)}
                            </Select>
                        </VStack>
                        <VStack>
                            <Text textAlign={"left"}>SS</Text>
                            <Select onClick={e => e.stopPropagation()} value={selectedTime.split(":")[2]} onChange={(e) => {
                                e.stopPropagation()
                                const curr = e.target as HTMLSelectElement
                                const second = curr.options[curr.selectedIndex].value
                                setSelectedTime((prev) => {
                                    const newTime = prev;
                                    const timeArray = newTime.split(":");
                                    timeArray[2] = second
                                    return timeArray.join(":")
                                })
                            }}>
                                {seconds.map((x, i) => <option key={`${keysForArrayComponents.calenderSecondOption}-${i}`}>{x}</option>)}
                            </Select>
                        </VStack>
                    </MotionMenuItem>}
                <MotionMenuItem display="flex" gap="30px">
                    {days.map((y, j) =>
                        <Text boxSize={"35px"} key={`${keysForArrayComponents.calenderDayNameOption}-${j}`}>{y ? y : ""}</Text>)}
                </MotionMenuItem>
                {calenderInfo.calender.map((x, i) => (
                    <MotionMenuItem as={Flex} key={`${keysForArrayComponents.calenderWeekOption}-${i}`} display="flex" gap="30px">
                        {x.map((y, j) => {
                            const tempSelectedDateArray = tempSelectedDate.split("-")
                            const tempSelectedDay = tempSelectedDateArray.length === 3 ? tempSelectedDateArray[2] : tempSelectedDateArray[1] === selectedDate.split("-")[1] ? y : ""
                            const newTempDate = tempSelectedDay && tempSelectedDateArray.length === 2 ? tempSelectedDate + '-' + tempSelectedDay : tempSelectedDate
                            const bgColor = +tempSelectedDay === y ? "brand.primary-blue" : ""
                            return <Button boxSize={"35px"} cursor="pointer" bgColor={bgColor} key={`${keysForArrayComponents.calenderDayOption}-${j}`} disabled={!y} onClick={() => {
                                // const 
                                const tempSelectedDateArray = tempSelectedDate.split("-")
                                tempSelectedDateArray[2] = `${y}`
                                setTempSelectedDate(tempSelectedDateArray.join("-"))
                            }} >{y ? y : ""}</Button>
                        })}
                    </MotionMenuItem>))
                }
            </MotionMenuList>
        </MotionMenu>

    )
}
export default AppCalendar