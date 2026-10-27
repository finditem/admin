import { DayOfWeek, PlaceCategory } from "@/api/fetch/admin";

export interface WeeklyScheduleFormValue {
  dayOfWeek: DayOfWeek;
  isClosed: boolean;
  businessStart: string;
  businessEnd: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
}

export interface PlaceFormValues {
  type: PlaceCategory | "";
  name: string;
  nameEn: string;
  address: string;
  addressEn: string;
  latitude: string;
  longitude: string;
  station: string;
  stationEn: string;
  stationDistanceMeters: string;
  weeklySchedules: WeeklyScheduleFormValue[];
  operationStartDate: string;
  operationEndDate: string;
  thumbnail: File | null;
  existingThumbnailUrl: string;
}
