import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Stat({ number, suffix = "", text }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const increment = number / (duration / 30);

    const timer = setInterval(() => {
      start += increment;

      if (start >= number) {
        setCount(number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <motion.div
      className="stat-item"
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.9,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
        transition: {
          duration: 0.25,
        },
      }}
    >
      <motion.h3
        className="stat-number"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.2,
          duration: 0.5,
        }}
      >
        {count}
        {suffix}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.35,
          duration: 0.5,
        }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}

export default Stat;