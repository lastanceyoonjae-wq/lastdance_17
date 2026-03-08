"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
export const dynamic = "force-dynamic"

export default function BoardPage() {
    // const supabase = createClient()

    const [supabase, setSupabase] = useState<any>(null)

    useEffect(() => {
        setSupabase(createClient())
    }, [])

    if (!supabase) return null
    
    const [posts, setPosts] = useState<any[]>([])
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState("")

    const loadPosts = async () => {
        const { data } = await supabase
            .from("board_posts")
            .select("*")
            .order("created_at", { ascending: false })

        setPosts(data || [])
    }

    const createPost = async () => {
        const { data: userData } = await supabase.auth.getUser()

        await supabase.from("board_posts").insert({
            user_id: userData.user?.id,
            title,
            content,
            image_url: image
        })

        setTitle("")
        setContent("")
        setImage("")

        loadPosts()
    }

    useEffect(() => {
        loadPosts()
    }, [])

    return (
        <div className="p-8 space-y-6">

            <h1 className="text-2xl font-bold">Board</h1>

            <Card className="p-4 space-y-3">
                <Input
                    placeholder="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Input
                    placeholder="image url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                <Input
                    placeholder="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <Button onClick={createPost}>Post</Button>
            </Card>

            {posts.map((p) => (
                <Card key={p.id} className="p-4 space-y-2">
                    <h2 className="font-bold">{p.title}</h2>
                    <p>{p.content}</p>

                    {p.image_url && (
                        <img src={p.image_url} className="w-60" />
                    )}
                </Card>
            ))}

        </div>
    )
}
