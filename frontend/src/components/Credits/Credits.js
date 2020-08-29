import React from 'react';
import SocialNetworkLink from './SocialNetworkLink';

const social = {
  twitter: 'NansDumortier',
  linkedIn: 'nans-dumortier',
  devTo: 'nans',
  github: 'NansD',
};
export default function Credits() {
  return (
    <>
      <div className="">
        <article className="message is-primary pb-5">
          <p className="message-header is-primary title">Auteur</p>
          <p className="subtitle message-body">
            Je m&apos;appelle Nans Dumortier, je suis ingénieur en développment web.
          </p>
          <div className="message-body is-flex  has-background-white" style={{ justifyContent: 'space-between' }}>
            <SocialNetworkLink
              href={`https://twitter.com/${social.twitter}`}
              color="#1da1f2"
            >
              <i className="fa fa-twitter-square fa-2x" />
            </SocialNetworkLink>
            <SocialNetworkLink
              href={`https://www.linkedin.com/in/${social.linkedIn}/`}
              color="#0077b5"
            >
              <i className="fa fa-linkedin-square fa-2x" />
            </SocialNetworkLink>
            <SocialNetworkLink
              href={`https://dev.to/${social.devTo}`}
              color="#000000"
            >
              <img src="./dev-icon.svg" className="dev-to" alt="Dev.to icon" />
            </SocialNetworkLink>
            <SocialNetworkLink
              href={`https://github.com/${social.github}`}
              color="#000000"
            >
              <i className="fa fa-github-square fa-2x" />
            </SocialNetworkLink>
          </div>
        </article>
        <article className="message is-info">
          <p className="title message-header">Logo</p>
          <div className="media subtitle message-body">
            <img className="image media-left is-128x128 is-inline" src="/logo-only.png" alt="croesus logo" />
            <p className="media-content">
              Logo créé gratuitement avec
              {' '}
              <a href="https://my.logomakr.com/">LogoMakr.com</a>
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
