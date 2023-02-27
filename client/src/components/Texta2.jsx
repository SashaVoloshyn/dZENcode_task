import React, { useState } from 'react'

export default function Texta2() {
    const [formText, setFormText] = useState('')
    const tags = [
        '<a href="#" title=""> </a>',
        '<code> </code>',
        '<i> </i>',
        '<strong> </strong>'
    ]

    const handleTagClick = (tag) => {
        setFormText(formText + tag)
    }

    const handleAllTagsClick = () => {
        setFormText(tags.join(' '))
    }

    const checkIfTagsClosed = () => {
        const regex =
            /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?(?:\s+title=(["'])(.*?)\3)?\s*>/gi
        const tags = formText.match(regex)

        const unclosedTags = []

        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i]
            const closingTag = `</a>`
            if (!formText.includes(closingTag, formText.indexOf(tag))) {
                unclosedTags.push(tag)
            }
        }

        if (unclosedTags.length === 0) {
            alert('All tags in form are closed!')
        } else {
            alert(`Unclosed tags: ${unclosedTags.join(', ')}`)
        }
    }

    return (
        <div>
            <form>
                <textarea
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                />
            </form>
            <div>
                {tags.map((tag, index) => (
                    <button key={index} onClick={() => handleTagClick(tag)}>
                        {tag}
                    </button>
                ))}
                <button onClick={handleAllTagsClick}>Insert all tags</button>
            </div>
            <button onClick={checkIfTagsClosed}>
                Check if tags are closed
            </button>
        </div>
    )
}
