// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import { createClient } from "@/lib/supabase/client"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { X } from "lucide-react"

// export default function ImageBoard() {

//   const supabase = createClient()

//   const [images, setImages] = useState<any[]>([])
//   const [tags, setTags] = useState<any>({})
//   const [users, setUsers] = useState<any[]>([])
//   const [openTag, setOpenTag] = useState<string | null>(null)

//   const [tagInput, setTagInput] = useState("")
//   const removeTag = async (tagId: string, imageId: string) => {

//     await supabase
//       .from("image_tags")
//       .delete()
//       .eq("id", tagId)

//     loadTags(imageId)
//   }

//   const addTag = async (imageId: string) => {

//     if (!tagInput) return

//     const tagList =
//       tagInput
//         .split("\n")
//         .map(t => t.trim())
//         .filter(t => t.length > 0)

//     for (const tag of tagList) {

//       // 1️⃣ 태그 존재 확인
//       let { data: existing } =
//         await supabase
//           .from("tags")
//           .select("*")
//           .eq("tag_text", tag)
//           .single()

//       let tagId

//       // 2️⃣ 없으면 생성
//       if (!existing) {

//         const { data: newTag } =
//           await supabase
//             .from("tags")
//             .insert({
//               tag_text: tag
//             })
//             .select()
//             .single()

//         tagId = newTag.id

//       } else {

//         tagId = existing.id

//       }

//       // 3️⃣ 이미지 태그 연결
//       await supabase
//         .from("image_tags")
//         .insert({
//           image_id: imageId,
//           tag_id: tagId
//         })

//     }

//     setTagInput("")
//     loadTags(imageId)

//   }

//   useEffect(() => {
//     loadImages()
//     loadUsers()
//   }, [])

//   const loadImages = async () => {

//     const { data } = await supabase
//       .from("images")
//       .select("*")
//       .order("created_at", { ascending: false })

//     setImages(data || [])
//   }

//   const loadUsers = async () => {

//     const { data } =
//       await supabase.from("profiles").select("*")

//     setUsers(data || [])
//   }

//   const uploadImage = async (file: File) => {

//     const fileName = Date.now() + file.name

//     await supabase.storage
//       .from("images")
//       .upload(fileName, file)

//     const imageUrl =
//       process.env.NEXT_PUBLIC_SUPABASE_URL +
//       "/storage/v1/object/public/images/" +
//       fileName

//     const { data: userData } = await supabase.auth.getUser()

//     await supabase.from("images").insert({
//       image_url: imageUrl,
//       user_id: userData.user?.id
//     })

//     loadImages()
//   }

//   // const addTag = async (imageId: string, userId: string) => {

//   //   await supabase.from("image_tags").insert({
//   //     image_id: imageId,
//   //     tagged_user_id: userId
//   //   })

//   //   loadTags(imageId)
//   // }

//   // const removeTag = async (tagId: string, imageId: string) => {

//   //   await supabase
//   //     .from("image_tags")
//   //     .delete()
//   //     .eq("id", tagId)

//   //   loadTags(imageId)
//   // }

//   return (

//     <div className="p-8 space-y-6">

//       <h1 className="text-2xl font-bold">Image Board</h1>

//       <input
//         type="file"
//         onChange={(e) => {
//           if (e.target.files) {
//             uploadImage(e.target.files[0])
//           }
//         }}
//       />

//       {/* responsive grid */}

//       <div className="grid
//   grid-cols-[repeat(auto-fill,minmax(250px,1fr))]
//   gap-4">

//         {images.map(img => (

//           <Card
//             key={img.id}
//             className="relative overflow-hidden group">

//             {/* 자동 비율 이미지 */}

//             <div className="relative w-full aspect-[4/3]">

//               <Image
//                 src={img.image_url}
//                 alt=""
//                 fill
//                 sizes="(max-width:768px)100vw,300px"
//                 className="object-cover"
//                 loading="lazy"
//               />

//             </div>

//             {/* 태그 toggle 버튼 */}

//             <div className="absolute bottom-2 left-2">

//               <Button
//                 size="sm"
//                 onClick={() => {

//                   if (openTag === img.id) {
//                     setOpenTag(null)
//                   } else {
//                     setOpenTag(img.id)
//                     loadTags(img.id)
//                   }

//                 }}
//                   >
//                 Tags
//               </Button>

//             </div>

//             {/* 태그 panel */}

//             {openTag === img.id && (

//               <div
//                 className="
//  absolute bottom-0 left-0 right-0
//  bg-black/80 p-3 space-y-2
//  max-h-[50%]
//  overflow-y-auto
//  "
//               >

//                 <div className="flex justify-between items-center">

//                   <span className="text-white text-sm">Tags</span>

//                   <button
//                     className="text-white text-sm"
//                     onClick={() => setOpenTag(null)}
//                   >
//                     close
//                   </button>

//                 </div>

//                 {/* existing tags */}

//                 {(tags[img.id] || []).map((tag: any) => (
//                   <div
//                     key={tag.id}
//                     className="
//  inline-flex
//  items-center
//  gap-1
//  bg-white text-black
//  px-2 py-[2px]
//  rounded
//  text-xs
//  whitespace-nowrap
// ">

//                     {tag.tags.tag_text}


//                     <X
//                       size={14}
//                       className="cursor-pointer"
//                       onClick={() => removeTag(tag.id, img.id)}
//                     />

//                   </div>
//                 ))}

//                 {/* tag input */}

//                 {/* <input
//                   className="px-2 py-1 text-black rounded"
//                   placeholder="add tag..."
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                 /> */}
//                 <textarea
//                   rows={3}
//                   className="
//  w-full
//  px-2 py-1
//  rounded
//  bg-black/60
//  text-white
//  placeholder-gray-300
//  border border-gray-600
// "
//                   placeholder="tag1
// tag2
// tag3"
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                 />                <Button
//                   size="sm"
//                   onClick={() => addTag(img.id)}
//                 >
//                   add
//                 </Button>

//               </div>

//             )}

//           </Card>

//         ))}

//       </div>

//     </div>

//   )
// }


"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Masonry from "react-masonry-css"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import MediaItem from "@/components/MediaItem"

export default function ImageBoard() {

  const supabase = createClient()

  const [images, setImages] = useState<any[]>([])
  const [tags, setTags] = useState<any>({})
  const [openTag, setOpenTag] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("created_at")
  const loader = useRef<HTMLDivElement | null>(null)

  const PAGE_SIZE = 12

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadImages()
      }
    })

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => observer.disconnect()

  }, [images])


  const loadTags = async (imageId: string) => {

    const { data } =
      await supabase
        .from("image_tags")
        .select(`
     id,
     tags (
       id,
       tag_text
     )
   `)
        .eq("image_id", imageId)

    setTags(prev => ({
      ...prev,
      [imageId]: data
    }))
  }

  const PAGE_SIZE = 30

  const loadImages = async () => {

    const { data } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    setImages(prev => [...prev, ...data])

  }
// 260306 21:30 수정
  // const loadImages = async () => {

  //   if (loading) return

  //   setLoading(true)

  //   const from = page * PAGE_SIZE
  //   const to = from + PAGE_SIZE - 1

  //   const { data } = await supabase
  //     .from("images")
  //     .select("*")
  //     .order(sortBy, { ascending: false })
  //     .range(from, to)

  //   if (data && data.length > 0) {

  //     setImages((prev) => {

  //       const map = new Map()

  //       const combined = [...prev, ...data]

  //       combined.forEach((img) => {
  //         map.set(img.id, img)
  //       })

  //       return Array.from(map.values())

  //     })

  //     setPage((prev) => prev + 1)

  //   }

  //   setLoading(false)

  // }


  const addTag = async (imageId: string) => {

    if (!tagInput) return

    const tagList =
      tagInput
        .split("\n")
        .map(t => t.trim())
        .filter(t => t.length > 0)

    for (const tag of tagList) {

      let { data: existing } =
        await supabase
          .from("tags")
          .select("*")
          .eq("tag_text", tag)
          .single()

      let tagId

      if (!existing) {

        const { data: newTag } =
          await supabase
            .from("tags")
            .insert({ tag_text: tag })
            .select()
            .single()

        tagId = newTag.id

      } else {

        tagId = existing.id

      }

      await supabase
        .from("image_tags")
        .insert({
          image_id: imageId,
          tag_id: tagId
        })

    }

    setTagInput("")
    loadTags(imageId)

  }



  const removeTag = async (tagId: string, imageId: string) => {

    await supabase
      .from("image_tags")
      .delete()
      .eq("id", tagId)

    loadTags(imageId)

  }



  const filterByTag = async (tag: string) => {

    const { data } =
      await supabase
        .from("image_tags")
        .select("image_id")
        .eq("tag_text", tag)

    const ids = data?.map(d => d.image_id)

    const { data: imgs } =
      await supabase
        .from("images")
        .select("*")
        .in("id", ids)

    setImages(imgs || [])
    setActiveTag(tag)

  }



  const clearFilter = () => {
    setImages([])
    setPage(0)
    setActiveTag(null)
    loadImages()
  }



  const breakpointColumns = {
    default: 4,
    1200: 3,
    800: 2,
    500: 1
  }



  return (

    <div className="p-8 space-y-6">

      <h1 className="text-2xl font-bold">
        Image Board
      </h1>
      <div className="flex gap-2">

        <Button
          size="sm"
          variant={sortBy === "created_at" ? "default" : "outline"}
          onClick={() => {
            setImages([])
            setPage(0)
            setSortBy("created_at")
          }}
        >
          Latest
        </Button>

        <Button
          size="sm"
          variant={sortBy === "likes" ? "default" : "outline"}
          onClick={() => {
            setImages([])
            setPage(0)
            setSortBy("likes")
          }}
        >
          Popular
        </Button>

      </div>

      <input
        type="file"
        onChange={async (e) => {

          if (!e.target.files) return

          const file = e.target.files[0]

          const fileName = Date.now() + file.name

          await supabase.storage
            .from("images")
            .upload(fileName, file)

          const imageUrl =
            process.env.NEXT_PUBLIC_SUPABASE_URL +
            "/storage/v1/object/public/images/" +
            fileName

          const { data: userData } =
            await supabase.auth.getUser()

          await supabase
            .from("images")
            .insert({
              image_url: imageUrl,
              user_id: userData.user?.id
            })

          setImages([])
          setPage(0)
          loadImages()

        }}
      />



      {activeTag && (

        <div className="flex items-center gap-3">

          <span>
            filter : #{activeTag}
          </span>

          <Button size="sm" onClick={clearFilter}>
            clear
          </Button>

        </div>

      )}



      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-4"
        columnClassName="space-y-4"
      >

        {images.map(img => (

          <div key={img.id} className="relative group">

            {/* <Image
              src={img.image_url}
              alt=""
              width={500}
              height={500}
              className="w-full h-auto rounded-lg object-cover"
              loading="lazy"
            /> */}
            <MediaItem url={img.image_url} />


            <Button
              size="sm"
              className="absolute bottom-2 left-2"
              onClick={() => {

                if (openTag === img.id) {

                  setOpenTag(null)

                } else {

                  setOpenTag(img.id)
                  loadTags(img.id)

                }

              }}
            >
              Tags
            </Button>



            {openTag === img.id && (

              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3 space-y-2 max-h-[50%] overflow-y-auto">

                <div className="flex justify-between">

                  <span className="text-white text-sm">
                    Tags
                  </span>

                  <button
                    className="text-white"
                    onClick={() => setOpenTag(null)}
                  >
                    ✕
                  </button>

                </div>



                <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto">

                  {(tags[img.id] || []).map(tag => {

                    const text = tag.tags?.tag_text || tag.tag_text

                    return (

                      <div
                        key={tag.id}
                        className="inline-flex items-center gap-1 bg-white text-black px-2 py-[2px] rounded text-xs whitespace-nowrap"
                      >

                        <span
                          className="cursor-pointer"
                          onClick={() => filterByTag(text)}
                        >
                          #{text}
                        </span>

                        <X
                          size={12}
                          className="cursor-pointer text-red-500"
                          onClick={() => removeTag(tag.id, img.id)}
                        />

                      </div>

                    )

                  })}

                </div>



                <textarea
                  rows={2}
                  className="w-full px-2 py-1 rounded bg-black/60 text-white placeholder-gray-300 border border-gray-600"
                  placeholder="tag1
tag2
tag3"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />



                <Button
                  size="sm"
                  onClick={() => addTag(img.id)}
                >
                  add tag
                </Button>

              </div>

            )}

          </div>

        ))}

      </Masonry>


      <div ref={loader} className="h-10" />


    </div>

  )

}