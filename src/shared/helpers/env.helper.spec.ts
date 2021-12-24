import { Env } from './env.helper';

describe('EnvHelper', () => {
  describe('getStringOrDefault', () => {
    test('should return the value of the environment variable', () => {
      const name = 'TEST_ENV_VAR';
      const value = 'test-value';
      process.env[name] = value;
      const result = Env.getStringOrDefault(name);
      expect(result).toBe(value);
    });

    test('should return the default value if the environment variable is not defined', () => {
      const name = 'TEST_ENV_VAR';
      const value = 'test-value';
      delete process.env[name];
      const result = Env.getStringOrDefault(name, value);
      expect(result).toBe(value);
    });
  });

  describe('getString', () => {
    test('should return env as string', () => {
      const name = 'test';
      jest.spyOn(Env, 'getStringOrDefault').mockReturnValue('test');
      const result = Env.getString(name);
      expect(result).toBe('test');
      expect(typeof result).toBe('string');
    });

    test('should throw if not found env variable', () => {
      const name = 'test';
      try {
        jest.spyOn(Env, 'getStringOrDefault').mockReturnValue(null);
        Env.getString(name);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(`environment ${name} not defined.`);
      }
    });
  });

  describe('getNumber', () => {
    test('should return env as number', () => {
      const name = 'test';
      jest.spyOn(Env, 'getString').mockReturnValue('123');
      const result = Env.getNumber(name);
      expect(result).toBe(123);
      expect(typeof result).toBe('number');
    });

    test('should throw if env isNaN', () => {
      const name = 'test';
      try {
        jest.spyOn(Env, 'getString').mockReturnValue(null);
        Env.getNumber(name);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          `expected environment ${name} to be a number.`,
        );
      }
    });
  });
});
