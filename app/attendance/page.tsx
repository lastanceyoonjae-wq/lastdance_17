"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function AttendancePage() {

    const supabase = createClient()

    const [date, setDate] = useState<Date | undefined>()
    const [count, setCount] = useState(0)

    const checkAttendance = async () => {

        const { data: userData } = await supabase.auth.getUser()

        await supabase.from("attendance").insert({
            user_id: userData.user?.id,
            date: new Date()
        })

        alert("출석 완료")
    }

    const loadCount = async () => {

        const today = new Date().toISOString().slice(0, 10)

        const { data } = await supabase
            .from("attendance")
            .select("*")
            .eq("date", today)

        setCount(data?.length || 0)
    }

    useEffect(() => {
        loadCount()
    }, [])

    return (
        <div className="p-8 space-y-6">

            <h1 className="text-2xl font-bold">Attendance</h1>

            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
            />

            <Button onClick={checkAttendance}>
                출석 체크
            </Button>

            <p>오늘 출석 인원 : {count}</p>

        </div>
    )
}
