import React, { ReactNode } from 'react';
import styles from '@/app/styles/Background.module.css';

interface BackgroundProps {
    children: ReactNode;
    className?: string;
}

const Background: React.FC<BackgroundProps> = ({ children, className = '' }) => {
    return (
        <div className={`${styles.wrapper} ${className}`}>
            <div className={styles.backgroundLayer} aria-hidden="true">
                <div className={`${styles.orb} ${styles.orb1}`} />
                <div className={`${styles.orb} ${styles.orb2}`} />
                <div className={`${styles.orb} ${styles.orb3}`} />
                <div className={`${styles.orb} ${styles.orb4}`} />
            </div>

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};

export default Background;