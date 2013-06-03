---
layout: post
title: "Ruby Koans: Greed"
date: 2013-05-13 23:23
comments: true
categories: Ruby
---
I decided to revisit the Ruby Koans and practice my refactoring skills.
[The Koan](http://koans.heroku.com/about_scoring_project) about the dice game
called Greed was a good one to refactor because I did it in a hurry and
just implemented the five rules more or less independent of each other.

<!--more-->

The result was the following code:

``` ruby Original solution, long and ugly
def score(dice)
  points = 0
  results = Hash.new(0)
  
  dice.each do |n|
    results[n] += 1
  end
  
  results.each do |number, occurences|
    if occurences >= 3
      if number == 1
        points += 1000
      else
        points += number * 100
      end
    end
  end

  if results[1] < 3
    points += results[1] * 100
  elsif results[1] > 3
    points += (results[1] - 3) * 100
  end

  if results[5] < 3
    points += results[5] * 50
  elsif results[5] > 3
    points += (results[5] - 3) * 50
  end

  return points
end
```

Instead of populating the hash I decided to loop from one to six (each possible
number) and get its count from the array. This saves work and memory since
creating a hash is unnecessary.

The second thing I did was to use postconditions where possible. I love them,
they can shorten code very easily without losing much readability.

The last thing I did was to subtract the already counted three elements at the
time they are counted, which leaves the extra scoring rules for five and one
much easier to implement.

``` ruby After refactoring, much better
def score(dice)
  score = 0

  1.upto(6) do |i|
    occurences = dice.count(i)
    if occurences >= 3
      score += i == 1 ? 1000 : i * 100
      occurences -= 3
    end

    score += occurences * 100 if i == 1
    score += occurences * 50 if i == 5
  end

  return score
end
```

I am still learning Ruby and if someone can make this shorter without losing
readability I would be interested to see how!