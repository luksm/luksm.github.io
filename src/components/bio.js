/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
            avatar
          }
          social {
            twitter
            github
            linkedin
            instagram
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <>
      <div className="bio">
        <img
          className="bio-avatar"
          src={author.avatar}
          width={50}
          height={50}
          quality={95}
          alt="Lucas Machado"
        />
        {author?.name && (
          <p>
            <strong>{author.name}</strong> {author?.summary || null}
          </p>
        )}
      </div>
      {social && (
        <p className="social-networks">
          {Object.entries(social).map(([key, value]) => (
            <a
              key="key"
              className={`icon icon-${key}`}
              href={`https://${key}.com/${value}`}
            >
              {key}
            </a>
          ))}
        </p>
      )}
    </>
  )
}

export default Bio
