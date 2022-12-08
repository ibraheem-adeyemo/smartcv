import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import {
  apiUrlsv1,
  appRoles,
  filterDates,
  filtersToShowDefaultValue,
  hours,
  minutes,
} from "../constants";
import {
  DropdownContent,
  Paginate,
  setFiltersToShowProps,
  TenantView,
  UserModel,
} from "../models";

import { getCurrentTime } from "../lib";

export default function useFilter(user?: UserModel) {
  const [selectedTenantCode, setSelectedTenantCode] = useState("0");
  const [ShowTenant, setShowTenant] = useState(true);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showCountInterval, setShowCountInterval] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  // debugger
  const apiUrl =
    typeof window !== "undefined" &&
    user &&
    user.role.name === appRoles.superAdmin
      ? apiUrlsv1.tenant
      : null;

  const {
    data: institutions,
    mutate,
    error: institutionsError,
  } = useSWR<Paginate<TenantView>>(apiUrl);
  const [searchText, setSearchText] = useState("");

  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth =
    `${today.getMonth() + 1}`.length === 1
      ? `0${today.getMonth() + 1}`
      : `${today.getMonth() + 1}`;
  const yesterdayDate =
    `${today.getDate() - 1}`.length === 1
      ? `0${today.getDate() - 1}`
      : `${today.getDate() - 1}`;
  const thisDate =
    `${today.getDate()}`.length === 1
      ? `0${today.getDate()}`
      : `${today.getDate()}`;
  const selectedDuration = 24;
  const selectedInterval = "hour";
  const completeEndDate = `${thisYear}-${thisMonth}-${thisDate}`;
  const completeEndTime = `${getCurrentTime()}`;
  const [startTime, setStartTime] = useState(
    `${thisYear}-${thisMonth}-${yesterdayDate} ${getCurrentTime()}`
  );
  const [endTime, setEndTime] = useState(
    `${completeEndDate} ${completeEndTime}`
  );
  const [period, SetPeriod] = useState(1);
  const [duration, setDuration] = useState(selectedDuration);
  const [countInterval, setCountInterval] = useState(selectedInterval);

  const [durationList, setDurationList] = useState(
    hours.map((x, i) => ({
      label: x,
      value: x,
      selected: i === 2,
    }))
  );
  const handleSearchText = (searchText: string) => {
    setSearchText(searchText);
  };

  const changeSelectedTenantCode = (tenantCode: string) => {
    setSelectedTenantCode(tenantCode);
  };

  const setFiltersToShow = useCallback(
    (filtersToshow: setFiltersToShowProps = filtersToShowDefaultValue) => {
      // debugger
      setShowTenant(filtersToshow.showTenantFilter as boolean);
      setShowStartDate(filtersToshow.showStartDateFilter as boolean);
      setShowEndDate(filtersToshow.showEndDateFilter as boolean);
      setShowCountInterval(filtersToshow.showCountIntervalFilter as boolean);
      setShowDuration(filtersToshow.showDurationFilter as boolean);
    },
    []
  );
  const getSelectedStartDate = useCallback(
    ({ date, time }: { date: string; time: string }) => {
      setStartTime(`${date} ${time}`);
    },
    []
  );
  const getSelectedEndDate = useCallback(
    ({ date, time }: { date: string; time: string }) => {
      setEndTime(`${date} ${time}`);
    },
    []
  );

  const onSelectedCountInterval = useCallback((e: DropdownContent) => {
    setCountInterval(e.value);
  }, []);
  const onSelectedDuration = useCallback((e: DropdownContent) => {
    setDuration(e.value);
  }, []);

  const getSelectedEndTime = useCallback((tim: Date) => {
    const completeEndDate = `${tim.getFullYear()}-${
      tim.getMonth() + 1
    }-${tim.getDate()}`;
    setEndTime(`${completeEndDate} ${getCurrentTime(tim)}`);
  }, []);

  useEffect(() => {
    const dayDifference =
      new Date(endTime).valueOf() - new Date(startTime).valueOf();
    SetPeriod(dayDifference / 1000 / 60 / 60 / 24);
  });
  useEffect(() => {
    // debugger
    if (countInterval) {
      switch (countInterval) {
        case "hour":
          setDurationList(
            hours.map((x, i) => ({
              label: x,
              value: x,
              selected: i === 2,
            }))
          );
          break;
        case "minute":
          setDurationList(
            minutes.map((x, i) => ({
              label: x,
              value: x,
              selected: i === 2,
            }))
          );
          break;
      }
    }
  }, [countInterval, endTime]);

  return {
    searchText,
    selectedTenantCode,
    institutions: institutions
      ? institutions.content
      : user && user?.role.name !== appRoles.superAdmin
      ? [user.tenant]
      : undefined,
    institutionsError,
    ShowTenant,
    showStartDate,
    showCountInterval,
    showEndDate,
    showDuration,
    startTime,
    endTime,
    duration,
    countInterval,
    durationList,
    period,
    changeSelectedTenantCode,
    handleSearchText,
    setFiltersToShow,
    getSelectedStartDate,
    getSelectedEndTime,
    getSelectedEndDate,
    onSelectedCountInterval,
    onSelectedDuration,
  };
}
