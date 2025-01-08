import { useEffect, useState } from 'react'

type PostType = {
  post_id: number
  username: string
  content: string
  created_at: string
}

export const Posts = () => {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false)
  const [isEditing, setIsEditing] = useState<number | null>(null) // 수정 중인 post_id
  const [formData, setFormData] = useState({ username: '', content: '', password: '' })
  const [editData, setEditData] = useState({ username: '', content: '' })
  //   const [editPassword, setEditPassword] = useState('') // 수정 비밀번호 확인용

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:8000/posts')
    const data = await response.json()
    setPosts(
      data.sort(
        (a: PostType, b: PostType) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    ) // 최신순 정렬
  }

  const handleCreate = async () => {
    await fetch('http://localhost:8000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setFormData({ username: '', content: '', password: '' })
    setIsCreatingNewPost(false)
    fetchPosts()
  }

  const handleEdit = async (post_id: number) => {
    await fetch(`http://localhost:8000/posts/${post_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    setIsEditing(null)
    fetchPosts()
  }

  const handleDelete = async (post_id: number) => {
    const password = prompt('비밀번호를 입력하세요:')
    const response = await fetch(`http://localhost:8000/verify-password/${post_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (response.ok) {
      await fetch(`http://localhost:8000/posts/${post_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      fetchPosts()
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  }

  const handleVerifyForEdit = async (post_id: number) => {
    const password = prompt('비밀번호를 입력하세요:')
    const response = await fetch(`http://localhost:8000/verify-password/${post_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (response.ok) {
      const post = posts.find((post) => post.post_id === post_id)
      if (post) {
        setEditData({ username: post.username, content: post.content })
        setIsEditing(post_id)
      }
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  }

  return (
    <div>
      <h1>Posts</h1>
      {isCreatingNewPost ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreate()
          }}
        >
          <input
            type='text'
            placeholder='Username'
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <textarea
            placeholder='Content'
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <input
            type='password'
            placeholder='Password'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type='submit'>등록</button>
          <button type='button' onClick={() => setIsCreatingNewPost(false)}>
            취소
          </button>
        </form>
      ) : (
        <button onClick={() => setIsCreatingNewPost(true)}>글쓰기</button>
      )}

      <ul>
        {posts.map((post) =>
          isEditing === post.post_id ? (
            <form
              key={post.post_id}
              onSubmit={(e) => {
                e.preventDefault()
                handleEdit(post.post_id)
              }}
            >
              <input
                type='text'
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              />
              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              />
              <button type='submit'>저장</button>
              <button type='button' onClick={() => setIsEditing(null)}>
                취소
              </button>
            </form>
          ) : (
            <li key={post.post_id}>
              <h3>{post.username}</h3>
              <p>{post.content}</p>
              <p>{new Date(post.created_at).toLocaleString()}</p>
              <button onClick={() => handleVerifyForEdit(post.post_id)}>수정</button>
              <button onClick={() => handleDelete(post.post_id)}>삭제</button>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
