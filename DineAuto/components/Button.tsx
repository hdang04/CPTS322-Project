import { Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from '../constants/Colors';
import { forwardRef, useState, useEffect} from 'react';

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => { 
    
    const [flashing, setFlashing] = useState(false);

    const handlePressIn = () => {
      setFlashing(true)
    }

    useEffect(() => {
      if (flashing) {
        const timeout = setTimeout(() => setFlashing(false), 175)
        return () => clearTimeout(timeout);
      }
    }, [flashing]);
    
    return (
      <Pressable ref={ref} {...pressableProps} onPressIn ={handlePressIn} 
      style={[styles.container,flashing && styles.flashing]}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  flashing: {
    backgroundColor: "#73B2DF"
  },
});

export default Button;