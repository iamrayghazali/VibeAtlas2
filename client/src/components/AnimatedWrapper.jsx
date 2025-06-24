import { motion } from "framer-motion";

const AnimatedWrapper = ({ children, duration = 1.2 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration, ease: "easeInOut" }}
            viewport={{ once: true, amount: 0.3 }} // 0.3 = start animating when 30% is visible
        >
            {children}
        </motion.div>
    );
};

export default AnimatedWrapper;