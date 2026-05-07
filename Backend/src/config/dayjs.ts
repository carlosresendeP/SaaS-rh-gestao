import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/pt-br"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("pt-br")

const TZ = "America/Sao_Paulo"

export const formatBR = (date: Date | string) =>
  dayjs.utc(date).tz(TZ).format("DD/MM/YYYY HH:mm")

export default dayjs