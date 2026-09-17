import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/logo/light.svg"
            alt={appName}
            width={138}
            height={36}
            className="dark:hidden"
          />
          <Image
            src="/logo/dark.svg"
            alt={appName}
            width={138}
            height={36}
            className="hidden dark:block"
          />
        </>
      ),
    },
    links: [
      {
        text: 'Home',
        url: '/',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
