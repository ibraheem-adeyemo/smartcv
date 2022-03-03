import React, { memo, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dashboardIcon, userManagementIcon, auditIcon, systemSettingsIcon, links, transactionMonitoringIcon, channelsMonitoringIcon, InterchangeDisconnectionIcon, AuthenticatedPage, menuNames, cookieKeys, cookiesTimeout } from "../../constants";
import { InterswitchLogo } from "../custom-component";
import { As, Avatar, Button, ComponentWithAs, Flex, Grid, GridItem, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, SkeletonCircle, Text } from "@chakra-ui/react";
import { SkeletonLoader } from "..";
import { AuthContext } from "../../providers/auth-provider";
import { AppLink } from "../app";
import { useRouter } from "next/router";
import { ComponentWithChildren } from "../../models";
import { useIdleTimer } from 'react-idle-timer'
import { getCookie } from "../../lib";
import { MotionFlex, MotionText } from "../framer";

interface AuthenticatedLayout extends ComponentWithChildren {
    pageHeader: string | JSX.Element
}
interface MenuListItem {
    icon: ComponentWithAs<As<any>, object>,
    name: string,
    link: string
}
const AuthenticatedLayout: React.FC<AuthenticatedLayout> = (props: AuthenticatedLayout) => {
    const { user, signOut, error, refreshAccessToken } = useContext(AuthContext)
    const router = useRouter()
    const handleOnIdle = (event: any) => {
        console.log('user is idle', event)
        console.log('last active', getLastActiveTime())
    }

    const handleOnActive = () => {
        if (typeof window !== "undefined") {
            const timeLeft = (new Date()).getTime() - (+getCookie(cookieKeys.tokenDurationDate) * 1000 * 60 * 60)
            if (timeLeft > (+getCookie(cookieKeys.tokenExpiresIn) - 5)) {
                refreshAccessToken(getCookie(cookieKeys.refreshToken))
            }
        }
    }

    const handleOnAction = () => {
        const timeLeft = (new Date()).getTime() - (+getCookie(cookieKeys.tokenDurationDate) * 1000 * 60 * 60)
        if (timeLeft > (+getCookie(cookieKeys.tokenExpiresIn) - 5)) {
            refreshAccessToken(getCookie(cookieKeys.refreshToken))
        }
    }

    const { getLastActiveTime } = useIdleTimer({
        timeout: typeof window !== "undefined" ? (new Date()).getTime() - (+getCookie(cookieKeys.tokenDurationDate) * 1000 * 60 * 60) : 1000 * 60 * 20,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        onAction: handleOnAction,
        debounce: 500
    })
    // console.log({ session })

    const MenuLists = memo(() => {

        const menuList: MenuListItem[] = [{
            icon: dashboardIcon,
            name: menuNames.dashboard,
            link: AuthenticatedPage[0]
        }, {
            icon: transactionMonitoringIcon,
            name: menuNames.transactionMonitoring,
            link: AuthenticatedPage[1]
        }, {
            icon: channelsMonitoringIcon,
            name: menuNames.channelsMonitoring,
            link: AuthenticatedPage[2]
        }, {
            icon: InterchangeDisconnectionIcon,
            name: menuNames.interchangeDisconnection,
            link: AuthenticatedPage[3]
        }, {
            icon: userManagementIcon,
            name: menuNames.userManagement,
            link: AuthenticatedPage[4]
        }, {
            icon: auditIcon,
            name: menuNames.audit,
            link: AuthenticatedPage[5]
        }, {
            icon: systemSettingsIcon,
            name: menuNames.systemSettings,
            link: ""
        }]
        return <>
            {menuList.map((x, i) =>
                <MotionText color="brand.muted" animate="show" initial="hide"
                    sx={{
                        mx: ["auto", "auto", "auto", 0, 0, 0]
                    }}
                    key={i}
                    variants={{
                        show: {
                            x: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.4,
                                delay: i * 0.4
                            }
                        },
                        hide: {
                            x: -200,
                            opacity: 0
                        }
                    }}>
                    <AppLink href={x.link ? x.link : "/"} d="flex" gridGap="20px" role="group"
                        _active={{
                            outline: "none"
                        }}
                        _focus={{
                            outline: "none"
                        }}
                        _hover={{
                            bgColor: "brand.light-blue",
                            cursor: "pointer"
                        }}
                        sx={{
                            fontSize: "16px",
                            bgColor: x.link === router.asPath ? "brand.light-blue" : "",
                            display: "flex",
                            pl: "13.9px",
                            pr: "13px",
                            py: "8px",
                            w: "fit-content",
                            alignItems: "center",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        <Icon as={x.icon} _groupHover={{
                            color: "brand.primary-blue"
                        }}
                            color={x.link === router.asPath ? "brand.primary-blue" : ""}
                            h="23px"
                            w="23px"
                        />
                        <Text sx={{
                            opacity: [0, 0, 0, 1, 1, 1],
                            display: ["none", "none", "none", "inline-block", "inline-block", "inline-block"],
                            textAlign:"left"
                        }} >{x.name}</Text>
                    </AppLink>
                </MotionText>)}
        </>
    })


    return (
        <Grid
            h={"100vh"}
            templateRows={"[row1-start] 89px [row1-end row2-start] 66px [row2-end row3-start] auto [row3-end] "}
            templateColumns={["74px auto", "74px auto", "74px auto", "274px auto", "274px auto", "374px auto"]}
            templateAreas={`
            "header header" 
            "sidebar pageHeader" 
            "sidebar main"`
            }
            backgroundColor="white"
        >
            <GridItem
                gridArea="header"
                borderBottom="0.5px solid #7F91A8"
                display="flex"
                justifyContent="space-between"
            >
                <Flex
                    borderBottom="0.5px solid #7F91A8"
                    h="89px">
                    <InterswitchLogo variant="sidbar-logo" />
                </Flex>
                <Flex alignItems="center" pr="39px">
                    <Menu>
                        <MenuButton as={Button} variant="just-text">
                            <Flex gridGap="42px" alignItems="center">

                                {typeof user === "undefined" && typeof error === "undefined" && <>
                                    <SkeletonLoader rows={1} width="100px" height="15px" columns={1} />
                                    <SkeletonCircle size="25" />
                                </>}
                                {typeof user !== "undefined" && typeof error === "undefined" && <MotionFlex >
                                    <Text size="dropdown-text" variant="dropdown-text-header"> Hello, {user?.firstName}</Text>
                                    <Avatar name={user?.firstName === null ? "" : `${user?.firstName} ${user?.lastName}`} src="" />
                                </MotionFlex>
                                }

                            </Flex>
                        </MenuButton>
                        <MenuList d="flex" gridGap="1px" flexDir="column" px="18px" pt="22px">
                            <MenuItem as={Flex} gridGap="11px" alignItems="center">

                                {!user && !error && <SkeletonCircle size="25" />}
                                {user && !error && <Avatar name={user?.firstName === null ? "" : `${user?.firstName} ${user?.lastName}`} src="" />}
                                <Flex flexDir="column" gridGap="1px">
                                    {typeof user !== "undefined" && typeof error === "undefined" &&
                                        <>
                                            <Text size="dropdown-text" variant="dropdown-text-header"> Hello, {user?.firstName}</Text>
                                            <Text variant="small-uted-tex"> {user?.email}</Text>
                                        </>
                                    }

                                    {!user && !error && <SkeletonLoader rows={2} width="100px" height="15px" columns={1} />}

                                </Flex>
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem>
                                {typeof user === "undefined" && typeof error === "undefined" && <SkeletonLoader rows={1} width="100px" height="15px" columns={1} />}

                                {typeof user !== "undefined" && typeof error === "undefined" && <Text size="dropdown-tes">Profile and Preferences</Text>}
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={() => signOut()}>
                                {!user && typeof error === "undefined" && <SkeletonLoader rows={1} width="100px" height="15px" columns={1} />}
                                {typeof user !== "undefined" && typeof error === "undefined" && <Text size="dropdown-tes">Signout</Text>}
                            </MenuItem>
                            <MenuDivider />
                        </MenuList>
                    </Menu>
                </Flex>
            </GridItem>
            <GridItem
                gridArea="sidebar"
                boxShadow="1px 0px 0px rgba(0, 0, 0, 0.15)"
                display="flex"
                gridGap="36.5px"
                pt="48px"
                flexDir="column"
                ml={[0, 0, 0, "40px", "40px", "40px"]}

                overflowX="auto"
            >
                {typeof user === "undefined" && typeof error === "undefined" && <SkeletonLoader rows={5} width="300px" columns={1} />}
                {typeof user !== "undefined" && typeof error === "undefined" && <MenuLists />}
            </GridItem>
            {typeof user === "undefined" && typeof error === "undefined" && <GridItem d="flex" w="100%" alignItems="center" px="50px">  <SkeletonLoader rows={1} width="200px" height="20px" columns={1} /></GridItem>}
            {typeof user !== "undefined" && typeof error === "undefined" &&
                <GridItem d="flex" w="100%" alignItems="center"> {typeof props.pageHeader === "string" ? <Text px="50px" variant="page-header">{props.pageHeader}</Text> : props.pageHeader}</GridItem>
            }


            {typeof user === "undefined" && typeof error === "undefined" && <Flex w="100%" h="100%"
                pl="50px"
                pr="55px"
                py="30px"> <SkeletonLoader rows={1} height="100%" width="100%" columns={1} /></Flex>}
            {typeof user !== "undefined" && typeof error === "undefined" &&
                <GridItem
                    gridArea="main"
                    pl="50px"
                    pr="55px"
                    py="30px"
                    bgColor="brand.main_page"
                    overflowY="auto"
                >
                    {props.children}

                </GridItem>
            }
        </Grid>)
}
export default AuthenticatedLayout