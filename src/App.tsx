import { useEffect, useState } from 'react'
import './App.css'
import { Posts } from './Posts'

type ImageType = {
  id: number
  image_key: string
  bucket_name: string
  description: string
  url: string
}

function App() {
  const [images, setImages] = useState([])

  // images 전체 fetching
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:8000/images')
        const data = await response.json()
        setImages(data)
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    fetchImages()
  }, [])

  return (
    <div className=''>
      <ul>
        {images.map((image: ImageType) => (
          <li key={image.id}>
            <img src={image.url} alt={image.description || 'Image'} width={200} />
          </li>
        ))}
      </ul>
      <Posts />
    </div>
  )
}

export default App
