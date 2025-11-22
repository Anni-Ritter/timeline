import { useEffect, useRef, useState } from "react";
import { periods } from "./data";
import './Timeline.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { gsap } from "gsap";

export const Timeline = () => {
    const [activePeriod, setActivePeriod] = useState(0);
    const fromRef = useRef<HTMLSpanElement | null>(null);
    const toRef = useRef<HTMLSpanElement | null>(null);
    const circleRef = useRef<HTMLDivElement | null>(null);
    const section = periods[activePeriod];
    const totalPeriods = periods.length;
    const prevYear = useRef(section.from);
    const prevToYear = useRef(section.to);
    const eventsSwiperRef = useRef<any>(null);
    const eventsAnimRef = useRef<HTMLDivElement | null>(null);

    const nextPeriod = () => {
        setActivePeriod(p => Math.min(p + 1, totalPeriods - 1));
    };

    const prevPeriod = () => {
        setActivePeriod(p => Math.max(p - 1, 0));
    };

    useEffect(() => {
        const fromObj = { val: prevYear.current };
        const toObj = { val: prevToYear.current };

        gsap.to(fromObj, {
            val: section.from,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: () => {
                if (fromRef.current) {
                    fromRef.current.textContent = Math.round(fromObj.val).toString();
                }
            }
        });

        gsap.to(toObj, {
            val: section.to,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: () => {
                if (toRef.current) {
                    toRef.current.textContent = Math.round(toObj.val).toString();
                }
            }
        });

        prevYear.current = section.from;
        prevToYear.current = section.to;
    }, [activePeriod]);

    useEffect(() => {
        gsap.to(eventsAnimRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
                if (eventsSwiperRef.current?.swiper) {
                    eventsSwiperRef.current.swiper.slideTo(0, 300);
                }
                gsap.to(eventsAnimRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    delay: 0.15,
                    ease: "power2.out"
                });
            }
        });
    }, [activePeriod]);

    return (
        <div className="timeline">
            <div className="timeline-wrapper__line timeline-wrapper__line--left"></div>
            <div className="timeline-wrapper__line timeline-wrapper__line--right"></div>

            <div className="timeline__top">
                <h2 className="timeline__title">Исторические даты</h2>
            </div>

            <div className="timeline__scene">
                <div className="timeline__years">
                    <span ref={fromRef}>{section.from}</span>
                    <span ref={toRef}>{section.to}</span>
                </div>
                <div className="timeline__circle" ref={circleRef}>
                    {periods.map((_, i) => {
                        const isActive = activePeriod === i;
                        const angle = 30 + (i - activePeriod) * (360 / totalPeriods);

                        return (
                            <button
                                key={i}
                                className={`timeline__dot ${isActive ? "timeline__dot--active" : ""}`}
                                style={{ ["--angle" as any]: `${angle}deg` }}
                                onClick={() => setActivePeriod(i)}
                            >
                                <span className="timeline__dot-num">{i + 1}</span>

                                {isActive && (
                                    <span className="timeline__label">{section.title}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="timeline__bottom">
                <div className="timeline__counter">
                    {(activePeriod + 1).toString().padStart(2, "0")}/
                    {totalPeriods.toString().padStart(2, "0")}
                </div>

                <div className="timeline__section-arrows">
                    <button className="timeline__arrow" onClick={prevPeriod} disabled={activePeriod === 0}>
                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.66418 0.707108L1.41419 6.95711L7.66418 13.2071" stroke="#42567A" stroke-width="2" />
                        </svg>
                    </button>
                    <button className="timeline__arrow" onClick={nextPeriod} disabled={activePeriod === totalPeriods - 1}>
                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.707092 0.707108L6.95709 6.95711L0.707093 13.2071" stroke="#42567A" stroke-width="2" />
                        </svg>
                    </button>
                </div>

                <div className="timeline__events" ref={eventsAnimRef}>
                    <button className="timeline__events-arrow timeline__events-arrow--left">
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "rotate(180deg)" }}>
                            <path d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071" stroke="#3877EE" stroke-width="2" />
                        </svg>
                    </button>
                    <Swiper
                        ref={eventsSwiperRef}
                        modules={[Navigation, FreeMode]}
                        freeMode={true}
                        slidesPerView={3}
                        spaceBetween={80}
                        navigation={{
                            prevEl: ".timeline__events-arrow--left",
                            nextEl: ".timeline__events-arrow--right"
                        }}
                    >
                        {section.events.map(p => (
                            <SwiperSlide key={p.year} className="timeline-card-slide" style={{ width: "auto" }}>
                                <div className="timeline-card">
                                    <div className="timeline-card__year">{p.year}</div>
                                    <div className="timeline-card__text">{p.text}</div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button className="timeline__events-arrow timeline__events-arrow--right">
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.707093 0.707092L5.70709 5.70709L0.707093 10.7071" stroke="#3877EE" stroke-width="2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
